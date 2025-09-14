//import authRouter from "./modules/auth/auth.router.js"
import connectDB from "../DB/connection.js";
import cors from 'cors';
import authRouter from "./modules/auth/auth.router.js"
import bookingRoutes from "./modules/booking/booking.router.js"
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
  app.use('/booking', bookingRoutes);

  return app;
};

export default initApp;