import express from 'express';
import { getBookings, createBooking, deleteBooking, updateBooking, filterBookings, getBookingDetails} from '../controllers/booking.controller.js';
import { auth, roles } from '../Middleware/auth.js';

const router = express.Router();


router.get('/all_booking', auth([roles.Admin, roles.Trainer]), getBookings);

router.post('/', auth([roles.Admin]),createBooking);

router.put('/:id', auth([roles.Admin, roles.Trainer]),updateBooking);

router.get('/:id', auth([roles.Admin, roles.Trainer, roles.Member]), getBookingDetails);
router.delete('/:id', auth([roles.Admin]),deleteBooking);
 router.get('/filter', auth([roles.Admin, roles.Trainer, roles.Member]),filterBookings);
export default router;
