import { createBooking,filterBookings,updateBooking,getBookingDetails,getBookings,deleteBooking } from '../../src/modules/booking/booking.controller.js';
import mongoose from 'mongoose';
import Booking from '../../DB/models/booking.model.js';
import BookingMember from '../../DB/models/bookingMembers.model.js';
import userModel from '../../DB/models/user.model.js'
jest.mock('../../DB/models/user.model.js');
jest.mock('../../DB/models/booking.model.js');
jest.mock('../../DB/models/bookingMembers.model.js'); // <--- مهم

describe('createBooking Unit Tests', () => {
  let req, res, next;
 
beforeEach(() => {
  req = { body: {}, user: {}, params: {}, query: {} };
res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};
next = jest.fn();

  Booking.findById.mockReset();
  Booking.findByIdAndUpdate.mockReset();
  Booking.findByIdAndDelete.mockReset();
  Booking.find.mockReset();
  Booking.create.mockReset();

  BookingMember.find.mockReset();
  BookingMember.deleteMany.mockReset();
  userModel.findById.mockReset();
});



  test('should return 403 if user is not admin', async () => {
    req.user.role = 'Coach';
    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'fail' }));
  });

  test('should return 400 if coach not found', async () => {
    req.user.role = 'Admin';
    req.body.coachId = new mongoose.Types.ObjectId();

    // Mock chain method findById().lean()
    userModel.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    });

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });


  test('should create booking successfully', async () => {
  req.user.role = 'Admin';
  req.body.coachId = new mongoose.Types.ObjectId();
  req.body.service = 'Yoga';
  req.body.date = '2049-01-01';
  req.body.timeStart = '10:00 AM';
  req.body.timeEnd = '11:00 AM';
  req.body.location = 'Room A';
  req.body.numberOfMembers = 5;

  // Mock userModel
  userModel.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue({ _id: req.body.coachId, role: 'Coach' })
  });

  // Mock Booking.find() for coach conflict
  Booking.find.mockImplementation(({ coach, date, location }) => {
    return {
      lean: jest.fn().mockResolvedValue([]) // ← لا يوجد حجوزات حالياً
    };
  });

  // Mock Booking.create
  Booking.create.mockResolvedValue({
    _id: new mongoose.Types.ObjectId(),
    ...req.body
  });

  await createBooking(req, res, next);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
});

  // ===== filterBookings =====
  test('filterBookings returns bookings for admin', async () => {
    req.user.role = 'Admin';
    req.query.coachId = new mongoose.Types.ObjectId().toString();
    Booking.aggregate.mockResolvedValue([{ _id: new mongoose.Types.ObjectId() }]);

    await filterBookings(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
  });

  // ===== getBookingDetails =====
  test('getBookingDetails returns 400 for invalid booking ID', async () => {
    req.user.role = 'Admin';
    req.params.id = 'invalid-id';

    await getBookingDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });

 test('getBookingDetails returns booking data for coach if owns the booking', async () => {
 const bookingId = new mongoose.Types.ObjectId();
const coachId = new mongoose.Types.ObjectId();

req.user.role = 'Coach';
req.userId = coachId.toString(); // هكذا تصبح String
req.params.id = bookingId.toString();

Booking.findById.mockReturnValue({
  lean: jest.fn().mockResolvedValue({ _id: bookingId, coach: coachId })
});


BookingMember.find.mockImplementation(() => ({
  select: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue([]),
  }),
}));

// تأكد من res mock قبل الاستدعاء
res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

await getBookingDetails(req, res, next);

expect(res.status).toHaveBeenCalledWith(200);
expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));

});

 test('updateBooking returns 403 if not authorized', async () => {
  const bookingId = new mongoose.Types.ObjectId();
  const coachId = new mongoose.Types.ObjectId();

  req.user.role = 'Member';
  req.userId = new mongoose.Types.ObjectId().toString();
  req.params.id = bookingId.toString();

  // Mock findById().lean()
  Booking.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue({ _id: bookingId, coach: coachId, date: req.body?.date, startMinutes: 600, endMinutes: 660 })
  });

  Booking.find.mockResolvedValue([]); // للتحقق من conflicts
  Booking.findByIdAndUpdate.mockResolvedValue({ ...req.body, _id: bookingId });
  userModel.findById.mockResolvedValue({ _id: coachId, role: 'Coach' });

  // تأكد من res mock
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await updateBooking(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
});
test('updateBooking updates booking successfully', async () => {
  const bookingId = new mongoose.Types.ObjectId();
  const coachId = new mongoose.Types.ObjectId();

  // ===== إعداد req =====
  req.user = { role: 'Admin' };
  req.userId = coachId.toString();
  req.params.id = bookingId.toString();
  req.body = {
    coachId,
    service: 'Yoga',
    date: '2049-01-01',
    timeStart: '10:30 AM',
    timeEnd: '11:30 AM',
    location: 'Room A'
  };

  // ===== mock Booking.findById().lean() =====
  Booking.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue({
      _id: bookingId,
      coach: coachId,
      date: req.body.date,
      startMinutes: 630, // 10:30 AM
      endMinutes: 690    // 11:30 AM
    })
  });

  // ===== mock Booking.find() للتحقق من التعارض =====
  Booking.find.mockReturnValue({
    lean: jest.fn().mockResolvedValue([]) // لا يوجد حجوزات متعارضة
  });

  // ===== mock Booking.findByIdAndUpdate =====
  Booking.findByIdAndUpdate.mockResolvedValue({
    _id: bookingId,
    ...req.body,
    startMinutes: 630,
    endMinutes: 690
  });

  // ===== mock userModel.findById().lean() =====
  userModel.findById.mockReturnValue({
    lean: jest.fn().mockResolvedValue({ _id: coachId, role: 'Coach' })
  });

  // ===== mock res =====
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  // ===== استدعاء الدالة =====
  await updateBooking(req, res, next);

  // ===== التأكد =====
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    status: 'success',
    data: expect.objectContaining({ service: 'Yoga', location: 'Room A' })
  }));
});


  // ===== deleteBooking =====
  test('deleteBooking returns 403 if not admin', async () => {
    req.user.role = 'Coach';
    req.params.id = new mongoose.Types.ObjectId().toString();

    await deleteBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });

test('deleteBooking deletes booking successfully', async () => {
  const bookingId = new mongoose.Types.ObjectId();
  req.user.role = 'Admin';
  req.params.id = bookingId.toString();

  BookingMember.deleteMany.mockResolvedValue({});
 Booking.findByIdAndDelete.mockReturnValue({
  lean: jest.fn().mockResolvedValue({ _id: bookingId })
});

  // تأكد من res mock
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await deleteBooking(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
});


});
