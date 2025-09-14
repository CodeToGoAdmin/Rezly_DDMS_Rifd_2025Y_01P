import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken'; // ✅ استيراد jwt
import app from './index.js'; // ملف express الرئيسي
import Booking from './DB/models/booking.model.js';
import User from './DB/models/user.model.js';

let mongoServer;
jest.setTimeout(20000); // 20 ثانية لجميع الاختبارات

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.disconnect(); // فصل الاتصال القديم
  await mongoose.connect(uri); // الاتصال الجديد فقط للاختبارات
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Booking.deleteMany();
  await User.deleteMany();
});

describe('Booking API', () => {
  let adminToken, trainerToken, memberToken;
  let trainer, trainerId; // <-- هنا
  beforeEach(async () => {
    const admin = await User.create({ userName: 'Admin', email: 'admin@test.com', password: 'hashed', role: 'Admin' });
    trainer = await User.create({ userName: 'Trainer', email: 'trainer@test.com', password: 'hashed', role: 'Trainer' });
    const member = await User.create({ userName: 'Member', email: 'member@test.com', password: 'hashed', role: 'Member' });

    trainerId = trainer._id;
    const secret = process.env.LOGINTOKEN || 'Bookinglogin12';

    adminToken = `Bearer ${jwt.sign({ id: admin._id, role: 'Admin' }, secret, { expiresIn: '1h' })}`;
    trainerToken = `Bearer ${jwt.sign({ id: trainer._id, role: 'Trainer' }, secret, { expiresIn: '1h' })}`;
    memberToken = `Bearer ${jwt.sign({ id: member._id, role: 'Member' }, secret, { expiresIn: '1h' })}`;
  });


  test('Admin can create a booking', async () => {
    const res = await request(app)
      .post('/booking')
      .set('Authorization', adminToken)
      .send({
        service: 'Yoga',
        trainerId: trainerId.toString(),
        date: new Date(),
        timeStart: '10:00 AM',
        timeEnd: '11:00 AM',
        location: 'Room A'
      });
  console.log(res.body); // <--- أضف هذا

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('service', 'Yoga');
  });

  test('Trainer cannot create a booking', async () => {
    const res = await request(app)
      .post('/booking')
      .set('Authorization', trainerToken)
      .send({
        service: 'Yoga',
        trainer: trainerId.toString(),
        date: new Date(),
        timeStart: '10:00',
        timeEnd: '11:00',
        location: 'Room A'
      });

    expect(res.statusCode).toBe(403); // forbidden
  });
 test('Admin and Trainer can get all bookings', async () => {
    await Booking.create({ service: 'Yoga', trainer: trainerId, date: new Date(), timeStart: '10:00', timeEnd: '11:00', location: 'Room A' });

    const resAdmin = await request(app)
      .get('/booking/all_booking')
      .set('Authorization', adminToken);

    const resTrainer = await request(app)
      .get('/booking/all_booking')
      .set('Authorization', trainerToken);

    expect(resAdmin.statusCode).toBe(200);
    expect(resTrainer.statusCode).toBe(200);
    expect(resAdmin.body.data.length).toBe(1);
    expect(resTrainer.body.data.length).toBe(1);
  });

  test('Filter bookings by trainer', async () => {
    await Booking.create({ service: 'Yoga', trainer: trainerId, date: new Date(), timeStart: '10:00', timeEnd: '11:00', location: 'Room A' });

    const res = await request(app)
      .get('/booking/filter')
      .set('Authorization', adminToken)
      .query({ trainerId: trainer._id.toString() });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  test('Get booking details by ID', async () => {
    const booking = await Booking.create({ service: 'Yoga', trainer: trainerId, date: new Date(), timeStart: '10:00AM', timeEnd: '11:00 AM', location: 'Room A' });

    const res = await request(app)
      .get(`/booking/${booking._id}`)
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('service', 'Yoga');
  });

  test('Admin can update a booking', async () => {
    const booking = await Booking.create({ service: 'Yoga', trainer: trainerId, date: new Date(), timeStart: '10:00 AM', timeEnd: '11:00 AM', location: 'Room A' });

    const res = await request(app)
      .put(`/booking/${booking._id}`)
      .set('Authorization', adminToken)
      .send({ service: 'Pilates' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('service', 'Pilates');
  });

  test('Admin can delete a booking', async () => {
    const booking = await Booking.create({ service: 'Yoga', trainer: trainerId, date: new Date(), timeStart: '10:00 AM', timeEnd: '11:00 AM', location: 'Room A' });

    const res = await request(app)
      .delete(`/booking/${booking._id}`)
      .set('Authorization', adminToken);

    expect(res.statusCode).toBe(200);
expect(res.body.message).toBe('Success');
  });
});