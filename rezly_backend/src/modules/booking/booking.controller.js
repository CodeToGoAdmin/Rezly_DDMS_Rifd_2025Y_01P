import Booking from '../../../DB/models/booking.model.js';
import BookingMember from '../../../DB/models/bookingMembers.model.js';
import userModel from '../../../DB/models/user.model.js'
import mongoose from 'mongoose';
import { AppError } from '../../Utils/catchError.js';

export const getBookings = async (req, res, next) => {
  try {
    const { userId, user } = req;
    const role = user.role.toLowerCase();

    let bookingsQuery;

    if (role === "admin") {
      bookingsQuery = Booking.find().select("_id name date coach"); // projection
    } else if (role === "coach") {
      bookingsQuery = Booking.find({ coach: userId }).select("_id name date coach");
    } else {
      // member
      const memberBookings = await BookingMember.find({ member: userId })
        .select("booking")
        .lean();

      const bookingIds = memberBookings.map(bm => bm.booking);
      bookingsQuery = Booking.find({ _id: { $in: bookingIds } }).select("_id name date coach");
    }

    // جلب الحجوزات مع lean()
    const bookings = await bookingsQuery.lean();

    if (bookings.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        metadata: { totalResults: 0, message: "No bookings found" },
        message: "Success",
      });
    }
    const bookingIds = bookings.map(b => b._id);
    const bookingMembers = await BookingMember.find({ booking: { $in: bookingIds } })
      .select("booking member -_id")
      .lean();

    const bookingMap = {};
    bookingMembers.forEach(bm => {
      const bid = bm.booking.toString();
      if (!bookingMap[bid]) bookingMap[bid] = [];
      bookingMap[bid].push(bm.member);
    });

    const result = bookings.map(b => ({
      ...b,
      members: bookingMap[b._id.toString()] || [],
    }));

    return res.status(200).json({
      status: "success",
      data: result,
      metadata: { totalResults: result.length, message: "Bookings fetched successfully" },
      message: "Success",
    });

  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};


function convertToMinutes(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export const createBooking = async (req, res, next) => {
  try {
    const {
      service,
      description,
      coachId,
      location,
      date,           // تاريخ بداية الحصة
      timeStart,      // الوقت كبداية
      timeEnd,        // الوقت كنهاية
      recurrence = [], // ["Mon", "Wed"]
      reminders = ["30m", "1h", "1d"],
      numbersOfMembers = 1,
      members = []
    } = req.body;

    // ===== صلاحيات المستخدم =====
    let finalCoachId = coachId;
    if (req.user.role === "Admin") {
      if (!coachId) return res.status(400).json({ status: "error", message: "Coach ID is required" });
    } else if (req.user.role === "Coach") {
      // الكوتش يقدر ينشئ حجز لنفسه فقط
      finalCoachId = req.user._id;
    } else {
      return res.status(403).json({ status: "error", message: "Not authorized to create bookings" });
    }

    // ===== تحقق من الكوتش =====
    const coach = await userModel.findById(finalCoachId).lean();
    if (!coach || coach.role.toLowerCase() !== "coach") {
      return res.status(400).json({ status: "error", message: "Coach not found or invalid role" });
    }

    // ===== تحقق من التاريخ والوقت =====
    const baseDate = new Date(date);
    if (isNaN(baseDate.getTime())) {
      return res.status(400).json({ status: "error", message: "Invalid date format" });
    }

    // دمج التاريخ مع الوقت
    const startDateTime = new Date(`${date}T${timeStart}`);
    const endDateTime = new Date(`${date}T${timeEnd}`);
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ status: "error", message: "Invalid start or end time" });
    }
    if (endDateTime <= startDateTime) {
      return res.status(400).json({ status: "error", message: "End time must be after start time" });
    }

    const now = new Date();
    if (startDateTime < now) {
      return res.status(400).json({ status: "error", message: "Booking time cannot be in the past" });
    }

    const weekDaysMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const createdBookings = [];

    // ===== تحقق من التعارض مع حجوزات الكوتش =====
    for (let i = 0; i < 365; i++) { // سنة كاملة للأيام المتكررة
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      const dayName = Object.keys(weekDaysMap).find(k => weekDaysMap[k] === currentDate.getDay());

      if (recurrence.length === 0 || recurrence.includes(dayName)) {

        // تحقق تعارض الكوتش
        const existingBookings = await Booking.find({ coach: finalCoachId, date: currentDate }).lean();
        const conflict = existingBookings.some(b => {
          const s = new Date(`${currentDate.toISOString().split("T")[0]}T${b.timeStart}`);
          const e = new Date(`${currentDate.toISOString().split("T")[0]}T${b.timeEnd}`);
          return Math.max(s, startDateTime) < Math.min(e, endDateTime);
        });
        if (conflict) continue;

        // ===== تحقق من تعارض الغرفة =====
        const roomBookings = await Booking.find({ location, date: currentDate }).lean();
        const roomConflict = roomBookings.some(b => {
          const s = new Date(`${currentDate.toISOString().split("T")[0]}T${b.timeStart}`);
          const e = new Date(`${currentDate.toISOString().split("T")[0]}T${b.timeEnd}`);
          return Math.max(s, startDateTime) < Math.min(e, endDateTime);
        });
        if (roomConflict) continue;

        // ===== إنشاء الحجز =====
        const newBooking = await Booking.create({
          service,
          description,
          coach: finalCoachId,
          location,
          date: currentDate,
          timeStart,
          timeEnd,
          numbersOfMembers,
          recurrence,
          reminders
        });

        // ===== التحقق من الأعضاء وإضافتهم =====
        if (Array.isArray(members) && members.length > 0) {
          const validMembers = [];
          for (const memberId of members) {
            if (!mongoose.Types.ObjectId.isValid(memberId)) continue;
            const member = await userModel.findById(memberId).lean();
            if (member && member.role.toLowerCase() === "member") validMembers.push(memberId);
          }
          if (validMembers.length > 0) {
            const existingBookingMembers = await BookingMember.find({ booking: newBooking._id }).lean();
            const existingMemberIds = existingBookingMembers.map(bm => bm.member.toString());
            const membersToAdd = validMembers.filter(id => !existingMemberIds.includes(id));
            if (membersToAdd.length > 0) {
              const bookingMembers = membersToAdd.map(memberId => ({
                booking: newBooking._id,
                member: memberId
              }));
              await BookingMember.insertMany(bookingMembers);
            }
          }
        }

        createdBookings.push(newBooking);
      }
    }

    if (createdBookings.length === 0) {
      return res.status(400).json({ status: "error", message: "No bookings created due to conflicts or invalid dates" });
    }

    return res.status(201).json({
      status: "success",
      data: createdBookings,
      message: "Bookings created successfully"
    });

  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


//compress, morgan login

export const updateBooking = async (req, res, next) => {
  try {
    const { userId, user } = req;
    const role = user.role.toLowerCase();

    const bookingId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ status: "error", message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ status: "error", message: "Booking not found" });
    }

    // ===== صلاحية التحديث =====
    if (
      role !== "admin" && !(role === "coach" && booking.coach.toString() === userId.toString())
    ) {
      return res.status(403).json({ status: "error", message: "Not authorized" });
    }

    // ===== البيانات الجديدة =====
    const { service, coachId, status, date, timeStart, timeEnd, location, members } = req.body;
    const updatedCoachId = coachId || booking.coach;

    const coach = await userModel.findById(updatedCoachId).lean();
    if (!coach || coach.role.toLowerCase() !== "coach") {
      return res.status(400).json({ status: "error", message: "Coach not found or invalid role" });
    }

    // ===== التحقق من التاريخ والوقت =====
    const bookingDate = date ? new Date(date) : new Date(booking.date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ status: "error", message: "Invalid date format" });
    }
    const now = new Date();
    if (bookingDate < new Date(now.toDateString())) {
      return res.status(400).json({ status: "error", message: "Booking date cannot be in the past" });
    }

    const startMinutes = timeStart ? convertToMinutes(timeStart) : booking.startMinutes;
    const endMinutes = timeEnd ? convertToMinutes(timeEnd) : booking.endMinutes;
    if (endMinutes <= startMinutes) {
      return res.status(400).json({ status: "error", message: "End time must be after start time" });
    }

    // ===== تحقق من التعارض =====
    const existingBookings = await Booking.find({ coach: updatedCoachId, date: bookingDate.toISOString().split('T')[0] }).lean();
    const conflict = existingBookings.some(b => {
      if (b._id.toString() === bookingId) return false; // تجاهل الحجز الحالي
      const s = convertToMinutes(b.timeStart);
      const e = convertToMinutes(b.timeEnd);
      return Math.max(s, startMinutes) < Math.min(e, endMinutes);
    });

    if (conflict) {
      return res.status(400).json({ status: "error", message: "Coach has a conflicting booking at this time" });
    }

    // ===== تجهيز التحديث =====
    const updateData = {
      service,
      coach: updatedCoachId,
      status,
      date,
      timeStart,
      timeEnd,
      startMinutes,
      endMinutes,
      location
    };

    // ===== تحديث الحجز =====
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true, runValidators: true, lean: true }
    );

    // ===== تحديث الأعضاء في BookingMember =====
    if (members && Array.isArray(members)) {
      // جلب الأعضاء الحاليين
      const currentMembers = await BookingMember.find({ booking: bookingId }).lean();
      const currentIds = currentMembers.map(m => m.member.toString());
      const newIds = members.map(id => id.toString());

      // أعضاء للإضافة
      const toAdd = newIds.filter(id => !currentIds.includes(id));
      for (const memberId of toAdd) {
        await BookingMember.create({ booking: bookingId, member: memberId });
      }

      // أعضاء للحذف
      const toRemove = currentIds.filter(id => !newIds.includes(id));
      await BookingMember.deleteMany({ booking: bookingId, member: { $in: toRemove } });
    }

    return res.status(200).json({ status: "success", data: updatedBooking, message: "Booking updated successfully" });

  } catch (err) {
    next(err);
  }
};

//typescript//singlton and design principles
export const deleteBooking = async (req, res, next) => {
  try {
    const { user, userId } = req;
    const role = user.role.toLowerCase();

    if (role !== "admin") {
      return res.status(403).json({ status: "error", message: "Not authorized: Admin only" });
    }

    const bookingId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ status: "error", message: "Invalid booking ID" });
    }

    await BookingMember.deleteMany({ booking: bookingId });

    const deleted = await Booking.findByIdAndDelete(bookingId).lean();
    if (!deleted) return res.status(404).json({ status: "error", message: "Booking not found" });

    return res.status(200).json({
      status: "success",
      data: null,
      metadata: { message: "Booking deleted successfully", totalResults: 0 },
      message: "Success"
    });

  } catch (err) {
    next(err);
  }
};

export const filterBookings = async (req, res) => {
  try {
    const { userId, user } = req;
    const role = user.role.toLowerCase();
    const { date, coachId, location } = req.query;
console.log(userId);
console.log(role);
   let query = {};

if (role === "admin") {
   if (coachId) query.coach = new mongoose.Types.ObjectId(coachId);
} else if (role === "coach") {
  query.coach = userId;
} else {
  query.members = { $elemMatch: { member: userId } };
}

if (date) query.date = new Date(date);  // لازم يكون Date object

    if (location) query.location = location;
console.log(query);
    console.log("Final query:", query);

    const bookings = await Booking.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "bookingmembers",        // collection اسمها BookingMember (Mongo يحولها lowercase + جمع)
          localField: "_id",
          foreignField: "booking",
          as: "members"
        }
      },
      {
        $lookup: {
          from: "users",                 // ربط الـ coach
          localField: "coach",
          foreignField: "_id",
          as: "coach"
        }
      },
      { $unwind: "$coach" },           // flatten coach
    ]);
    return res.json({
      status: "success",
      data: bookings,
      metadata: { totalResults: bookings.length, message: "Bookings fetched successfully" },
      message: "Success"
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: [],
      metadata: { totalResults: 0, message: err.message },
      message: "Error"
    });
  }
};

export const calendarView = async (req, res) => {
  try {
    const filter = {};

    // إذا المستخدم دوره "coach" رجّع حجوزاته فقط
    if (req.user.role?.toLowerCase() === "coach") {
      filter.coach = req.user._id;
    }
console.log(filter);
    const bookings = await Booking.find(filter)
      .select("date timeStart timeEnd coach")
      .lean();

    const calendarEvents = bookings.map(b => ({
      start: `${b.date.toISOString().split('T')[0]}T${b.timeStart}`,
      end: `${b.date.toISOString().split('T')[0]}T${b.timeEnd}`,
      date: b.date.toISOString().split('T')[0],
      coachId: b.coach, // ممكن تحتاجه بالفرونت
    }));

    res.json({
      status: "success",
      data: calendarEvents,
      message: "Calendar bookings fetched successfully",
    });

  } catch (err) {
    console.error("Calendar fetch error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch calendar bookings",
      error: err.message,
    });
  }
};


export const getBookingDetails = async (req, res, next) => {
  try {
    const { userId, user } = req; // موجود من middleware auth
    const role = user.role.toLowerCase();
    const bookingId = req.params.id;
console.log(role);
console.log(bookingId);
    // تحقق من صحة الـ ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid booking ID"
      });
    }
console.log(userId);
    // جلب الحجز المطلوب فقط
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found"
      });
    }

  
    if (role === "coach" && booking.coach.toString() !== userId.toString() ) {
       
      return res.status(403).json({ status: "error", message: "Not authorized" });

    }

    if (role === "member") {
    

      const memberBooking = await BookingMember.findOne({ booking: bookingId, member: userId });
      if (!memberBooking) {
        return res.status(403).json({ status: "error", message: "Not authorized" });
      }
    }

    if (!["admin", "coach", "member"].includes(role)) {
            
      return res.status(403).json({ status: "error", message: "Not authorized" });
    }

    // جلب الأعضاء المرتبطين بالحجز
    const bookingMembers = await BookingMember.find({ booking: bookingId })
      .select("member")
      .lean();

    booking.members = bookingMembers.map(bm => bm.member);

    return res.status(200).json({
      status: "success",
      data: booking,
      message: "Booking details fetched successfully"
    });

  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
export const cancelBooking = async (req, res, next) => {
  try {
    const { userId, user } = req; // من الـ middleware
    const role = user.role.toLowerCase();
    const bookingId = req.params.bookingId;
console.log(bookingId);
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid booking ID"
      });
    }

    // جلب الحجز
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found"
      });
    }

    // تحقق من الصلاحيات
    if (role === "coach") {
      if (booking.coach.toString() !== userId.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Not authorized to cancel this booking"
        });
      }
    } else if (role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to cancel bookings"
      });
    }

    // تحقق إذا الحجز ملغي أصلاً
    if (booking.status === "cancelled") {
      return res.status(400).json({
        status: "error",
        message: "Booking is already cancelled"
      });
    }

    // تحديث حالة الحجز
    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
      data: booking
    });

  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

export default {
  createBooking,
  getBookings,
  getBookingDetails,
  updateBooking,
  deleteBooking
}