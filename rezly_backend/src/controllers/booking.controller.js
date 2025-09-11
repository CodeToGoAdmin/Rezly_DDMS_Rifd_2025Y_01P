import Booking from '../../DB/models/booking.model.js';
import BookingMember from '../../DB/models/bookingMembers.model.js';
import userModel from '../../DB/models/user.model.js'
import mongoose from 'mongoose';
   import jwt from "jsonwebtoken";
import { AppError } from '../Utils/catchError.js';

function checkRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.query.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }
    next();
  };
}

export const getBookings = async (req, res, next) => {
  try {
    // ✅ بيانات المستخدم موجودة من middleware auth
    const { userId, user } = req;
    const role = user.role.toLowerCase();

    let bookings = [];
    
    if (role === "admin") {
      // Admin يشوف كل الحجوزات
      bookings = await Booking.find().lean();
    } else if (role === "trainer") {
      // Trainer يشوف حجوزاته فقط
      bookings = await Booking.find({ trainer: userId }).lean();
    } else {
      // Member يشوف الحجوزات اللي هو مشارك فيها
      const memberBookings = await BookingMember.find({ member: userId }).select("booking").lean();
      const bookingIds = memberBookings.map(bm => bm.booking);
      bookings = await Booking.find({ _id: { $in: bookingIds } }).lean();
    }

    // ربط الأعضاء مع كل حجز مرة واحدة
    const bookingIds = bookings.map(b => b._id);
    const bookingMembers = await BookingMember.find({ booking: { $in: bookingIds } })
      .select("booking member")
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

    // لو ما في حجوزات، نرسل رسالة no data
    if (result.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        metadata: { totalResults: 0, message: "No bookings found" },
        message: "Success",
      });
    }

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
    const { userId, user } = req;
    const role = user.role.toLowerCase();

    // ===== 2️⃣ جلب البيانات من البودي =====
    const { service, trainerId, date, timeStart, timeEnd, location } = req.body;

    // ===== 3️⃣ تحقق من المدرب =====
    const trainer = await userModel.findById(trainerId).lean();
    if (!trainer || trainer.role.toLowerCase() !== "trainer") {
      return res.status(400).json({ status: "error", message: "Trainer not found or invalid role" });
    }

    // ===== 4️⃣ تحقق من التاريخ والوقت =====
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

    // ===== 6️⃣ إنشاء الحجز =====
    const newBooking = await Booking.create({
      service,
      trainer: trainerId,
      date,
      timeStart,
      timeEnd,
      startMinutes,
      endMinutes,
      location
    });

    return res.status(201).json({
      status: "success",
      data: newBooking,
      message: "Booking created successfully"
    });

  } catch (err) {
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
            console.log("gmkfjmgjkfd");

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

    // جاهز لـ real-time updates لاحقاً
    // io.emit("updateBooking", updatedBooking);

    return res.status(200).json({ status: "success", data: updatedBooking, message: "Booking updated successfully" });

  } catch (err) {
    next(err);
  }
};



export const deleteBooking = async (req, res, next) => {
  try {
         const { userId, user } = req;
    const role = user.role.toLowerCase();
    console.log(role);
    if (role !== "admin") {
      return res.status(403).json({ status: "error", message: "Not authorized: Admin only" });
    }

    const bookingId = req.params.id;
    if (!bookingId || !bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: "error", message: "Invalid booking ID" });
    }

    await BookingMember.deleteMany({ booking: bookingId });

    const deleted = await Booking.findByIdAndDelete(bookingId);
    if (!deleted) return res.status(404).json({ status: "error", message: "Booking not found" });

    // 7️⃣ رد بالنجاح
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

    // 2️⃣ بناء الـ query حسب الدور
    let query = {};
    if (role.toLowerCase() === "admin") {
      if (trainerId) query.trainer = trainerId;
    } else if (role.toLowerCase() === "trainer") {
      query.trainer = userId;
    } else {
      // العضو يشوف فقط الحجوزات اللي هو عضو فيها
      query.members = { $elemMatch: { member: userId } };
    }

    if (date) query.date = date;
    if (location) query.location = location;

    // 3️⃣ جلب الحجوزات مع populate آمنة
    let bookings = await Booking.find(query)
      .populate("trainer", "name email")
      .lean();

    // 4️⃣ التأكد أن members موجودة حتى لو فارغة
    bookings = bookings.map(b => {
      if (!b.members) b.members = [];
      // populate members data manually إذا تحب، مثال:
      b.members = b.members.map(m => ({
        memberId: m.member?._id || null,
        name: m.member?.name || null,
        email: m.member?.email || null,
        status: m.status || null
      }));
      return b;
    });

    // 5️⃣ الرد
    const metadata = { totalResults: bookings.length, message: "Bookings fetched successfully" };
    return res.json({ status: "success", data: bookings, metadata, message: "Success" });

  } catch (err) {
    const metadata = { message: err.message, totalResults: 0 };
    return res.status(500).json({ status: "error", data: [], metadata, message: "Error" });
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