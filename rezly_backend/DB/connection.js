import mongoose from 'mongoose';
import 'dotenv/config'; // لتحميل المتغيرات من .env

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
    console.log('🚫 Skipping DB connection in test mode');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
