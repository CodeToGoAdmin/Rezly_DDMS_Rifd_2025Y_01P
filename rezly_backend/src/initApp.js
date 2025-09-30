//import authRouter from "./modules/auth/auth.router.js"
import connectDB from "../DB/connection.js";
import cors from 'cors';
import authRouter from "./modules/auth/auth.router.js"
import bookingRouter from "./modules/booking/booking.router.js"
import packageRouter from './modules/package/package.router.js';
import formRouter from './modules/forms/forms.routers.js';

import express from 'express';
const initApp = () => {
  const app = express();
  connectDB();

  app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE','PATCH'],
    allowedHeaders: ['Content-Type','Authorization','ngrok-skip-browser-warning']
  }));

  app.use(express.json());
  
  app.use('/auth', authRouter);
  app.use('/booking', bookingRouter);
  app.use('/package', packageRouter);
    app.use('/forms', formRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
  });
  return app;
};

export default initApp;

