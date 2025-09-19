// tests/integration/booking.int.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Booking from '../../DB/models/booking.model.js';
import userModel from '../../DB/models/user.model.js';

import {
  createBooking,
  getBookings,
  getBookingDetails,
  updateBooking,
  deleteBooking
} from '../../src/modules/booking/booking.controller.js';

let mongoServer;

beforeAll(async () => {
    
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Booking.deleteMany({});
  await userModel.deleteMany({});
});

describe('Booking Controller - Integration Tests', () => {
  let req, res, next;
  let coach, admin, otherUser, booking;

beforeEach(async () => {
  req = { body: {}, params: {}, query: {}, userId: '', user: {} };
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  next = jest.fn();

  coach = await userModel.create({ 
    userName: 'coachUser',
    name: 'Coach', 
    email: `coach${Date.now()}@test.com`, 
    role: 'Coach', 
    password: '123456' 
  });

  admin = await userModel.create({ 
    userName: 'adminUser',
    name: 'Admin', 
    email: `admin${Date.now()}@test.com`, 
    role: 'Admin', 
    password: '123456' 
  });

  otherUser = await userModel.create({
    userName: 'otherUser',
    password: '123456',
    role: 'Coach',
    email: 'otherUser@example.com'
  });

  booking = await Booking.create({
    service: 'Yoga',
    coach: coach._id,
    date: '2099-01-01',
    timeStart: '10:00 AM',
    timeEnd: '11:00 AM',
    location: 'Room A',
    numberOfMembers: 5
  });

  req.user = { _id: admin._id, role: 'Admin' };
});


 it("should create a booking successfully", async () => {
    const req = {
      user: { _id: admin._id, role: "Admin" },
      body: {
        service: "Yoga",
        coachId: coach._id,
        date: "2029-01-01",
       timeStart: "11:30 AM", // وقت جديد
  timeEnd: "12:30 PM",
        location: "Room A",
        numberOfMembers: 5
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success" })
    );
  });


  it('should get bookings for admin', async () => {
    await Booking.create([
      { service: 'Yoga', coach: coach._id, date: '2099-01-01', timeStart: '10:00 AM', timeEnd: '11:00 AM', location: 'Room A', numberOfMembers: 5 },
      { service: 'Pilates', coach: coach._id, date: '2099-01-02', timeStart: '12:00 PM', timeEnd: '1:00 PM', location: 'Room B', numberOfMembers: 3 }
    ]);

    req.user = { role: 'Admin', _id: admin._id };

    await getBookings(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
  });

  it('should get booking details by ID', async () => {
    req.params.id = booking._id.toString();
    req.user = { role: 'Admin', _id: admin._id };

    await getBookingDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
  });

  it('should update a booking successfully', async () => {
    req.params.id = booking._id.toString();
    req.body = { service: 'Updated Yoga' };
    req.user = { role: 'Admin', _id: admin._id };

    await updateBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));

    const updatedBooking = await Booking.findById(booking._id);
    expect(updatedBooking.service).toBe('Updated Yoga');
  });

  it('should delete a booking successfully', async () => {
    req.params.id = booking._id.toString();
    req.user = { role: 'Admin', _id: admin._id };

    await deleteBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));

    const deletedBooking = await Booking.findById(booking._id);
    expect(deletedBooking).toBeNull();
  });

  it('should not allow non-admin to create a booking', async () => {
    req.user = { _id: coach._id, role: 'Coach' };
    req.body = {
      service: 'Pilates',
      coachId: coach._id,
      date: '2099-01-02',
      timeStart: '12:00 PM',
      timeEnd: '1:00 PM',
      location: 'Room B',
      numberOfMembers: 3
    };

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'fail' }));
  });

  it('should return 404 when updating a non-existing booking', async () => {
    req.params.id = new mongoose.Types.ObjectId(); // ID غير موجود
    req.body = { service: 'Updated Service' };
    req.user = { _id: admin._id, role: 'Admin' };

    await updateBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error', message: 'Booking not found' }));
  });

  it('should not allow a user to delete another user’s booking', async () => {
    req.params.id = booking._id.toString();
    req.user = { _id: otherUser._id, role: 'Coach' };

    await deleteBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });

  it('should fail to create booking with missing required fields', async () => {
    req.user = { _id: admin._id, role: 'Admin' };
    req.body = { service: 'Yoga' }; // بيانات ناقصة

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error',message:'Coach not found or invalid role' }));
  });
});
