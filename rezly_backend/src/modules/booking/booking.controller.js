import Booking from '../../../DB/models/booking.model.js';
import BookingMember from '../../../DB/models/bookingMembers.model.js';
import userModel from '../../../DB/models/user.model.js'
import mongoose from 'mongoose';
import { AppError } from '../../Utils/catchError.js';
import { Employee } from '../../../DB/models/employee.model.js';

export const getBookings = async (req, res, next) => {
  try {
    const { userId, user } = req;
    const role = user.role.toLowerCase();

    let bookingsQuery;

    if (role === "admin") {
      bookingsQuery = Booking.find();
    } else if (role === "coach") {
      bookingsQuery = Booking.find({ coach: userId });
    } else {
      const memberBookings = await BookingMember.find({ member: userId })
        .select("booking")
        .lean();
      const bookingIds = memberBookings.map(bm => bm.booking);
      bookingsQuery = Booking.find({ _id: { $in: bookingIds } });
    }

    const bookings = await bookingsQuery.lean();
    if (bookings.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        metadata: { totalResults: 0, message: "No bookings found" },
        message: "Success",
      });
    }

    // جلب الأعضاء لكل حجز
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

    // دمج البيانات
    const result = bookings.map(b => ({
      ...b,
      members: bookingMap[b._id.toString()] || [],
      membersCount: (bookingMap[b._id.toString()] || []).length,
      groupId: b.groupId || null
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



function convertArabicTimeTo24Hour(timeStr) {
  if (!timeStr) return null;

  // نظف المسافات
  timeStr = timeStr.trim();

  // استخراج الساعة والدقيقة
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(ص|م)?/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3]; // ص أو م

  if (period === "م" && hour < 12) hour += 12;
  if (period === "ص" && hour === 12) hour = 0;

  // صيغة 24 ساعة
  return `${hour.toString().padStart(2, "0")}:${minute}`;
}
export const createBooking = async (req, res, next) => {
  try {
  const {
  service,
  description,
  coachId,
  location,
  date,
  timeStart,
  timeEnd,
  recurrence = [],
  reminders = [],
  maxMembers,
  members = [],
  subscriptionDuration
} = req.body;

// فحص التاريخ
const selectedDate = new Date(date);
const today = new Date();

// نحذف الوقت من التاريخ الحالي للمقارنة فقط بالتاريخ
today.setHours(0, 0, 0, 0);
selectedDate.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  return res.status(400).json({
    message: "لا يمكن اختيار تاريخ في الماضي. يرجى تحديد تاريخ اليوم أو بعده."
  });
}

    let finalCoachId = coachId;
    if (req.user.role === "Admin") {
      if (!coachId)
        return res.status(400).json({ status: "error", message: "Coach ID is required" });
    } 
    else if (req.user.role === "Coach") {
      finalCoachId = req.user._id;
    } else {
      return res.status(403).json({ status: "error", message: "Not authorized to create bookings" });
    }
    // ===== تحقق من الكوتش =====
    const coach = await Employee.findById(finalCoachId).lean();
    if (!coach || coach.role.toLowerCase() !== "coach") {
      return res.status(400).json({ status: "error", message: "Coach not found or invalid role" });
    }

    // ===== تحقق من التاريخ والوقت =====
    const baseDate = new Date(date);
    if (isNaN(baseDate.getTime())) {
      return res.status(400).json({ status: "error", message: "Invalid date format" });
    }
const createdBookings = [];

// ===== اليوم الأول =====
const firstStart = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(timeStart)}`);
const firstEnd = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(timeEnd)}`);

// ===== نطاق اليوم بالكامل =====
const startOfDay = new Date(baseDate);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(baseDate);
endOfDay.setHours(23, 59, 59, 999);

// ===== تحقق من تعارض الكوتش =====
const existingCoachBookings = await Booking.find({
  coach: finalCoachId,
  date: { $gte: startOfDay, $lte: endOfDay }
}).lean();

const conflictFirstCoach = existingCoachBookings.some(b => {
  const s = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(b.timeStart)}`);
  const e = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(b.timeEnd)}`);
  return Math.max(s, firstStart) < Math.min(e, firstEnd);
});

// ===== تحقق من تعارض الغرفة =====
const existingRoomBookings = await Booking.find({
  location,
  date: { $gte: startOfDay, $lte: endOfDay }
}).lean();

const conflictFirstRoom = existingRoomBookings.some(b => {
  const s = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(b.timeStart)}`);
  const e = new Date(`${baseDate.toISOString().split("T")[0]}T${convertArabicTimeTo24Hour(b.timeEnd)}`);
  return Math.max(s, firstStart) < Math.min(e, firstEnd);
});

if (conflictFirstCoach) {
  return res.status(400).json({ status: "error", message: "هذا الكوتش لديه حجز آخر في نفس الوقت" });
}

if (conflictFirstRoom) {
  return res.status(400).json({ status: "error", message: "الغرفة محجوزة في نفس الوقت" });
}
const groupId = new mongoose.Types.ObjectId();


const newFirstBooking = await Booking.create({
  service,
  description,
  coach: finalCoachId,
  location,
  date: baseDate,
  timeStart,
  timeEnd,
  maxMembers,
  recurrence,
  reminders,
  subscriptionDuration,
  groupId 

});
createdBookings.push(newFirstBooking);
   if (members.length > 0) {
      const bookingMembers = members.map((memberId) => ({
        booking: newFirstBooking._id,
        member: memberId,
        joinedAt: new Date(),
      }));

      await BookingMember.insertMany(bookingMembers);
    }
  
let weeksToRepeat = 1;
switch (subscriptionDuration) {
  case "1week": weeksToRepeat = 1; break;
  case "2weeks": weeksToRepeat = 2; break;
  case "3weeks": weeksToRepeat = 3; break;
  case "1month": weeksToRepeat = 4; break;
  case "3months": weeksToRepeat = 12; break;
  case "6months": weeksToRepeat = 24; break;
  case "1year": weeksToRepeat = 52; break;
  default: weeksToRepeat = 1; break;
}
let conflictedDays = [];

const weekDaysMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
for (let w = 0; w < weeksToRepeat; w++) {
  for (const day of recurrence) {
    const dayIndex = weekDaysMap[day];
    
    // نبدأ من نسخة جديدة من baseDate دايمًا
    const currentDate = new Date(baseDate.getTime());

    // نحسب أول occurrence من اليوم
    const offset = (dayIndex - baseDate.getDay() + 7) % 7;
    
    // نضيف offset + الأسابيع اللاحقة
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset + w * 7);

    // ما نكرر أول يوم بأول أسبوع
    if (w === 0 && offset === 0) continue;

    const dateString = newDate.toISOString().split("T")[0];
    const startDateTimeCurrent = new Date(`${dateString}T${convertArabicTimeTo24Hour(timeStart)}`);
    const endDateTimeCurrent = new Date(`${dateString}T${convertArabicTimeTo24Hour(timeEnd)}`);

    // ===== تحقق من التعارض مع الكوتش =====
    const existingCoachBookings = await Booking.find({
      coach: finalCoachId,
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lte: new Date(`${dateString}T23:59:59.999Z`)
      }
    }).lean();

    const conflictCoach = existingCoachBookings.some(b => {
      const s = new Date(`${dateString}T${convertArabicTimeTo24Hour(b.timeStart)}`);
      const e = new Date(`${dateString}T${convertArabicTimeTo24Hour(b.timeEnd)}`);
      return (startDateTimeCurrent < e && endDateTimeCurrent > s);
    });

    // ===== تحقق من التعارض مع الغرفة =====
    const existingRoomBookings = await Booking.find({
      location,
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lte: new Date(`${dateString}T23:59:59.999Z`)
      }
    }).lean();

    const conflictRoom = existingRoomBookings.some(b => {
      const s = new Date(`${dateString}T${convertArabicTimeTo24Hour(b.timeStart)}`);
      const e = new Date(`${dateString}T${convertArabicTimeTo24Hour(b.timeEnd)}`);
      return (startDateTimeCurrent < e && endDateTimeCurrent > s);
    });

    if (conflictCoach || conflictRoom) {
      conflictedDays.push({
        date: dateString,
        reason: conflictCoach ? "Coach busy" : "Room busy"
      });
      continue;
    }

    // ===== إنشاء الحجز =====
    const newBooking = await Booking.create({
      service,
      description,
      coach: finalCoachId,
      location,
      date: newDate,
      timeStart,
      timeEnd,
      maxMembers,
      recurrence,
      reminders,
      subscriptionDuration,
      groupId 

    });

    createdBookings.push(newBooking);
  }
}

return res.status(201).json({
  status: "success",
  data: createdBookings,
  conflictedDays, // هذه الأيام يلي ما انخزنت
  message: "Partial bookings created; some days conflicted"
});


  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

//compress, morgan login
export const updateBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const {
      service,
      description,
      coachId,
      location,
      date,
      timeStart,
      timeEnd,
      recurrence = [],
      reminders = [],
      maxMembers,
      members = [],
      subscriptionDuration
    } = req.body;

    // جلب الحجز الحالي
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ status: "error", message: "Booking not found" });
    }

    // صلاحية المستخدم
    let finalCoachId = coachId || existingBooking.coach;
    if (req.user.role === "Admin") {
      if (!finalCoachId)
        return res.status(400).json({ status: "error", message: "Coach ID is required" });
    } else if (req.user.role === "Coach") {
      if (existingBooking.coach.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: "error", message: "Not authorized to update this booking" });
      }
      finalCoachId = req.user._id;
    } else {
      return res.status(403).json({ status: "error", message: "Not authorized" });
    }

    // التحقق من الكوتش
    const coach = await Employee.findById(finalCoachId).lean();
    if (!coach || coach.role.toLowerCase() !== "coach") {
      return res.status(400).json({ status: "error", message: "Coach not found or invalid role" });
    }

    // ===== فحص التاريخ =====
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ message: "لا يمكن اختيار تاريخ في الماضي. يرجى تحديد تاريخ اليوم أو بعده." });
    }

    // ===== تحويل الوقت العربي لساعات ودقائق =====
    const toHourMinuteArray = (timeStr) => {
      const [time, meridiem] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (meridiem === "م" && hours !== 12) hours += 12;
      if (meridiem === "ص" && hours === 12) hours = 0;
      return [hours, minutes];
    };

    const [startH, startM] = toHourMinuteArray(timeStart);
    const [endH, endM] = toHourMinuteArray(timeEnd);

    // Helper to create Date from date string + time
    const makeDateTime = (dateStr, hours, minutes) => {
      const d = new Date(dateStr);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const firstStart = makeDateTime(date, startH, startM);
    const firstEnd = makeDateTime(date, endH, endM);

    // ===== تحقق من التعارض مع الكوتش والغرفة للحجز الرئيسي =====
    const startOfDay = makeDateTime(date, 0, 0);
    const endOfDay = makeDateTime(date, 23, 59);

    const existingCoachBookings = await Booking.find({
      _id: { $ne: bookingId },
      coach: finalCoachId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    const conflictCoach = existingCoachBookings.some(b => {
      const [sH, sM] = toHourMinuteArray(b.timeStart);
      const [eH, eM] = toHourMinuteArray(b.timeEnd);
      const s = makeDateTime(b.date, sH, sM);
      const e = makeDateTime(b.date, eH, eM);
      return firstStart < e && firstEnd > s;
    });

    const existingRoomBookings = await Booking.find({
      _id: { $ne: bookingId },
      location,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    const conflictRoom = existingRoomBookings.some(b => {
      const [sH, sM] = toHourMinuteArray(b.timeStart);
      const [eH, eM] = toHourMinuteArray(b.timeEnd);
      const s = makeDateTime(b.date, sH, sM);
      const e = makeDateTime(b.date, eH, eM);
      return firstStart < e && firstEnd > s;
    });

    if (conflictCoach) return res.status(400).json({ status: "error", message: "هذا الكوتش لديه حجز آخر في نفس الوقت" });
    if (conflictRoom) return res.status(400).json({ status: "error", message: "الغرفة محجوزة في نفس الوقت" });

    // ===== تحديث الحجز الرئيسي =====
    existingBooking.service = service || existingBooking.service;
    existingBooking.description = description || existingBooking.description;
    existingBooking.coach = finalCoachId;
    existingBooking.location = location || existingBooking.location;
    existingBooking.date = date; // <-- keep as string "YYYY-MM-DD"
    existingBooking.timeStart = timeStart || existingBooking.timeStart;
    existingBooking.timeEnd = timeEnd || existingBooking.timeEnd;
    existingBooking.maxMembers = maxMembers || existingBooking.maxMembers;
    existingBooking.recurrence = recurrence.length ? recurrence : existingBooking.recurrence;
    existingBooking.reminders = reminders.length ? reminders : existingBooking.reminders;
    existingBooking.subscriptionDuration = subscriptionDuration || existingBooking.subscriptionDuration;

    await existingBooking.save();

    // ===== تحديث الأعضاء =====
    if (Array.isArray(members) && members.length > 0) {
      await BookingMember.deleteMany({ booking: existingBooking._id });
      const bookingMembers = members.map(memberId => ({
        booking: existingBooking._id,
        member: memberId,
        joinedAt: new Date()
      }));
      await BookingMember.insertMany(bookingMembers);
    }

    // ===== التعامل مع recurrence بنفس الطريقة مع تخزين التاريخ كسلسلة =====
    let createdBookings = [existingBooking];
    let conflictedDays = [];

    if (recurrence.length && subscriptionDuration) {
      const weekDaysMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const weeksToRepeat = { "1week":1, "2weeks":2, "3weeks":3, "1month":4, "3months":12, "6months":24, "1year":52 }[subscriptionDuration] || 1;

      for (let w = 0; w < weeksToRepeat; w++) {
        for (const day of recurrence) {
          const dayIndex = weekDaysMap[day];
          const offset = (dayIndex - new Date(date).getDay() + 7) % 7;
          const newDate = new Date(date);
          newDate.setDate(newDate.getDate() + offset + w*7);
          const newDateStr = newDate.toISOString().split("T")[0]; // keep as string

          if (w === 0 && offset === 0) continue; // skip the first occurrence

          const startDateTimeCurrent = makeDateTime(newDateStr, startH, startM);
          const endDateTimeCurrent = makeDateTime(newDateStr, endH, endM);

          const existingCoachBookings = await Booking.find({
            _id: { $ne: bookingId },
            coach: finalCoachId,
            date: newDateStr
          }).lean();

          const conflictCoach = existingCoachBookings.some(b => {
            const [bsH, bsM] = toHourMinuteArray(b.timeStart);
            const [beH, beM] = toHourMinuteArray(b.timeEnd);
            const s = makeDateTime(b.date, bsH, bsM);
            const e = makeDateTime(b.date, beH, beM);
            return startDateTimeCurrent < e && endDateTimeCurrent > s;
          });

          const existingRoomBookings = await Booking.find({
            _id: { $ne: bookingId },
            location,
            date: newDateStr
          }).lean();

          const conflictRoom = existingRoomBookings.some(b => {
            const [bsH, bsM] = toHourMinuteArray(b.timeStart);
            const [beH, beM] = toHourMinuteArray(b.timeEnd);
            const s = makeDateTime(b.date, bsH, bsM);
            const e = makeDateTime(b.date, beH, beM);
            return startDateTimeCurrent < e && endDateTimeCurrent > s;
          });

          if (conflictCoach || conflictRoom) {
            conflictedDays.push({ date: newDateStr, reason: conflictCoach ? "Coach busy" : "Room busy" });
            continue;
          }

          const newBooking = await Booking.create({
            service,
            description,
            coach: finalCoachId,
            location,
            date: newDateStr,
            timeStart,
            timeEnd,
            maxMembers,
            recurrence,
            reminders,
            subscriptionDuration
          });
          createdBookings.push(newBooking);
        }
      }
    }

    return res.status(200).json({
      status: "success",
      data: createdBookings,
      conflictedDays,
      message: "Booking updated successfully; some days conflicted"
    });

  } catch (err) {
    console.error("Booking update error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


//typescript//singlton and design principles

export const deleteBooking = async (req, res, next) => {
  try {
    const { user } = req;
    const role = user.role.toLowerCase();
    const bookingId = req.params.id;

    // 🔹 التحقق من الـ ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ status: "error", message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ status: "error", message: "Booking not found" });
    }

    if (role === "admin") {
      // 🔹 حذف كل أعضاء الحجز أولاً ثم الحجز نفسه
      await BookingMember.deleteMany({ booking: bookingId });
      await Booking.findByIdAndDelete(bookingId);

      return res.status(200).json({
        status: "success",
        message: "Booking and related members deleted successfully (by Admin)",
      });
    }

    if (role === "coach") {
      if (booking.coach.toString() !== user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You are not authorized to cancel this booking",
        });
      }

      // 🔹 تحديث حالة الحجز إلى cancelled بدون حذف أعضاء الحجز
      await Booking.updateOne(
        { _id: bookingId },
        { $set: { status: "cancelled", cancelledAt: new Date() } }
      );

      return res.status(200).json({
        status: "success",
        message: "Booking has been cancelled successfully",
      });
    }

    // 🔹 المستخدم مش Admin ولا Coach
    return res.status(403).json({
      status: "error",
      message: "Not authorized to delete or cancel bookings",
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