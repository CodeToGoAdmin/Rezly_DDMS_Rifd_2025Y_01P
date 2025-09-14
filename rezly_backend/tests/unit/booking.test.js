// tests/unit/booking.controller.test.js
import * as BookingController from '../../src/modules/booking/booking.controller.js';
import Booking from '../../DB/models/booking.model.js';
import User from '../../DB/models/user.model.js';
import { AppError } from '../../AppError.js';

jest.mock('../../DB/models/booking.model.js');
jest.mock('../../DB/models/user.model.js');
jest.setTimeout(150000); // 60 ثانية

describe('Booking Controller - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, user: { id: 'userId', role: 'Admin' }, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      req.body = {
        service: 'Yoga',
        trainerId: 'trainerId',
        date: new Date(),
        timeStart: '10:00 AM',
        timeEnd: '11:00 AM',
        location: 'Room A',
        numberOfMembers: 3
      };

      // mock user lookup
      User.findById.mockResolvedValue({ role: 'Trainer' });
      // mock existing bookings
      Booking.find.mockResolvedValue([]);
      // mock create
      Booking.create.mockResolvedValue({ ...req.body, _id: 'bookingId' });

      await BookingController.createBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: expect.objectContaining({ service: 'Yoga' })
      }));
    });

    it('should return error if trainer not found', async () => {
      req.body.trainerId = 'trainerId';
      User.findById.mockResolvedValue(null);

      await BookingController.createBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should return error if booking conflicts with existing', async () => {
      req.body = {
        service: 'Yoga',
        trainerId: 'trainerId',
        date: new Date(),
        timeStart: '10:00 AM',
        timeEnd: '11:00 AM',
        location: 'Room A',
      };

      User.findById.mockResolvedValue({ role: 'Trainer' });
      Booking.find.mockResolvedValue([{ timeStart: '10:30 AM', timeEnd: '11:30 AM' }]);

      await BookingController.createBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings for admin', async () => {
      Booking.find.mockResolvedValue([{ service: 'Yoga' }]);
      req.user.role = 'Admin';

      await BookingController.getAllBookings(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: [{ service: 'Yoga' }]
      }));
    });
  });

  describe('getBookingById', () => {
    it('should return booking by ID', async () => {
      Booking.findById.mockResolvedValue({ service: 'Yoga' });
      req.params.id = 'bookingId';

      await BookingController.getBookingById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: expect.objectContaining({ service: 'Yoga' })
      }));
    });

    it('should call next if booking not found', async () => {
      Booking.findById.mockResolvedValue(null);
      req.params.id = 'bookingId';

      await BookingController.getBookingById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('updateBooking', () => {
    it('should update a booking successfully', async () => {
      Booking.findByIdAndUpdate.mockResolvedValue({ service: 'Pilates' });
      req.params.id = 'bookingId';
      req.body = { service: 'Pilates' };

      await BookingController.updateBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        data: { service: 'Pilates' }
      }));
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking successfully', async () => {
      Booking.findByIdAndDelete.mockResolvedValue(true);
      req.params.id = 'bookingId';

      await BookingController.deleteBooking(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        message: 'Success'
      }));
    });
  });
});
