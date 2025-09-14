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
      bookingsQuery = Booking.find().select("_id name date trainer"); // projection
    } else if (role === "trainer") {
      bookingsQuery = Booking.find({ trainer: userId }).select("_id name date trainer");
    } else {
      // member
      const memberBookings = await BookingMember.find({ member: userId })
        .select("booking")
        .lean();

      const bookingIds = memberBookings.map(bm => bm.booking);
      bookingsQuery = Booking.find({ _id: { $in: bookingIds } }).select("_id name date trainer");
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

    // ربط الأعضاء مرة واحدة لكل الحجز
    const bookingIds = bookings.map(b => b._id);
    const bookingMembers = await BookingMember.find({ booking: { $in: bookingIds } })
      .select("booking member -_id")
      .lean();

    // إنشاء خريطة لحجز -> أعضاء
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
    const {  user } = req;

    const { service, trainerId, date, timeStart, timeEnd, location ,numberOfMembers} = req.body;

    const trainer = await userModel.findById(trainerId).lean();
    if (!trainer || trainer.role.toLowerCase() !== "trainer") {
      return res.status(400).json({ status: "error", message: "Trainer not found or invalid role" });
    }

    const now = new Date();
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ status: "error", message: "Invalid date format" });
    }
    if (bookingDate < new Date(now.toDateString())) { // لا تسمح بالتواريخ الماضية
      return res.status(400).json({ status: "error", message: "Booking date cannot be in the past" });
    }

    const startMinutes = convertToMinutes(timeStart);
    const endMinutes = convertToMinutes(timeEnd);

    if (endMinutes <= startMinutes) {
      return res.status(400).json({ status: "error", message: "End time must be after start time" });
    }

    // ===== 5️⃣ تحقق من التعارض مع الحجوزات الحالية =====
    const existingBookings = await Booking.find({ trainer: trainerId, date }).lean();
    const conflict = existingBookings.some(b => {
      const s = convertToMinutes(b.timeStart);
      const e = convertToMinutes(b.timeEnd);
      return Math.max(s, startMinutes) < Math.min(e, endMinutes);
    });

    if (conflict) {
      return res.status(400).json({ status: "error", message: "Trainer has a conflicting booking at this time" });
    }
 const roomBookings = await Booking.find({ location, date }).lean();
    const roomConflict = roomBookings.some(b => {
      const s = convertToMinutes(b.timeStart);
      const e = convertToMinutes(b.timeEnd);
      return Math.max(s, startMinutes) < Math.min(e, endMinutes);
    });
    if (roomConflict) {
      return res.status(400).json({ status: "error", message: "Room is already booked at this time" });
    }

    const newBooking = await Booking.create({
      service,
      trainer: trainerId,
      date,
      timeStart,
      timeEnd,
      startMinutes,
      endMinutes,
      location,
      numberOfMembers
    });

    return res.status(201).json({
      status: "success",
      data: newBooking,
      message: "Booking created successfully"
    });

  } catch (err) {
     console.error("Booking creation error:", err); // <--- أ
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
       const { userId, user } = req;
    const role = user.role.toLowerCase();
console.log(req.user);
console.log(role);

    const bookingId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ status: "error", message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ status: "error", message: "Booking not found" });
    }
console.log(booking.trainer.toString() );
console.log(userId.toString);
    // ===== 3️⃣ صلاحية التحديث =====
    if (
      role.toLowerCase() !== "admin" && !(role.toLowerCase() === "trainer" && booking.trainer.toString() === userId.toString())
    ) {
          

      return res.status(403).json({ status: "error", message: "Not authorized" });
    }

    // ===== 4️⃣ البيانات الجديدة =====
    const { service, trainerId, status, date, timeStart, timeEnd, location } = req.body;
    const updatedTrainerId = trainerId || booking.trainer;

    const trainer = await userModel.findById(updatedTrainerId).lean();
    if (!trainer || trainer.role.toLowerCase() !== "trainer") {
      return res.status(400).json({ status: "error", message: "Trainer not found or invalid role" });
    }

    // ===== 5️⃣ التحقق من التاريخ والوقت =====
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

    // ===== 6️⃣ تحقق من التعارض =====
    const existingBookings = await Booking.find({ trainer: updatedTrainerId, date: bookingDate.toISOString().split('T')[0] }).lean();
    const conflict = existingBookings.some(b => {
      if (b._id.toString() === bookingId) return false; // تجاهل الحجز الحالي
      const s = convertToMinutes(b.timeStart);
      const e = convertToMinutes(b.timeEnd);
      return Math.max(s, startMinutes) < Math.min(e, endMinutes);
    });

    if (conflict) {
      return res.status(400).json({ status: "error", message: "Trainer has a conflicting booking at this time" });
    }

    // ===== 7️⃣ تحديث الحجز =====
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { service, trainer: updatedTrainerId, status, date, timeStart, timeEnd, startMinutes, endMinutes, location },
      { new: true, runValidators: true, lean: true }
    );


    return res.status(200).json({ status: "success", data: updatedBooking, message: "Booking updated successfully" });

  } catch (err) {
    next(err);
  }
};

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
    const { date, trainerId, location } = req.query;
console.log(userId);
console.log(role);
   let query = {};

if (role === "admin") {
   if (trainerId) query.trainer = new mongoose.Types.ObjectId(trainerId);
} else if (role === "trainer") {
  query.trainer = userId;
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
          from: "users",                 // ربط الـ trainer
          localField: "trainer",
          foreignField: "_id",
          as: "trainer"
        }
      },
      { $unwind: "$trainer" },           // flatten trainer
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
    const bookings = await Booking.find().select("date timeStart timeEnd").lean();

    const calendarEvents = bookings.map(b => ({
      start: `${b.date.toISOString().split('T')[0]}T${b.timeStart}`,
      end: `${b.date.toISOString().split('T')[0]}T${b.timeEnd}`,
      date: b.date.toISOString().split('T')[0]
    }));

    res.json({
      status: "success",
      data: calendarEvents,
      message: "Calendar bookings fetched successfully"
    });

  } catch (err) {
    console.error('Calendar fetch error:', err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch calendar bookings",
      error: err.message
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
console.log(booking.trainer.toString() );
    // التحقق من الصلاحيات حسب الدور
    if (role === "trainer" && booking.trainer.toString() !== userId.toString() ) {
            console.log("gmkfjmgjkfd");

      return res.status(403).json({ status: "error", message: "Not authorized" });

    }

    if (role === "member") {
            console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");

      const memberBooking = await BookingMember.findOne({ booking: bookingId, member: userId });
      if (!memberBooking) {
        return res.status(403).json({ status: "error", message: "Not authorized" });
      }
    }

    if (!["admin", "trainer", "member"].includes(role)) {
            console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");
      console.log("gmkfjmgjkfd");

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