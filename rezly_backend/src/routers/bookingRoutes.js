import express from 'express';
import { getBookings, createBooking, deleteBooking, updateBooking, filterBookings, getBookingDetails, calendarView} from '../controllers/booking.controller.js';
import { auth, roles } from '../Middleware/auth.js';
import { createBookingSchema, updateBookingSchema, validateObjectId } from '../modules/auth/booking.validation.js';
import { validateBody } from '../Middleware/validation.js';
import Booking from '../../DB/models/booking.model.js';

const router = express.Router();

// جلب كل الحجوزات (Admin & Trainer)
router.get('/all_booking', auth([roles.Admin, roles.Trainer]), getBookings);

// فلترة الحجوزات (Admin, Trainer, Member)
router.get('/filter', auth([roles.Admin, roles.Trainer, roles.Member]), filterBookings);

// عرض الحجوزات في Calendar (Admin & Trainer)
router.get('/calendar', auth([roles.Admin, roles.Trainer]), calendarView);
// إنشاء حجز جديد (Admin فقط)
router.post('/', auth([roles.Admin]), validateBody(createBookingSchema), createBooking);

// ================= Dynamic / parameterized routes =================

// جلب تفاصيل حجز حسب ID
router.get('/:id', auth([roles.Admin, roles.Trainer, roles.Member]), validateObjectId('id'), getBookingDetails);

// تحديث حجز حسب ID (Admin & Trainer)
router.put('/:id', auth([roles.Admin, roles.Trainer]), validateBody(updateBookingSchema), updateBooking);

// حذف حجز حسب ID (Admin فقط)
router.delete('/:id', auth([roles.Admin]), validateObjectId('id'), deleteBooking);

export default router;