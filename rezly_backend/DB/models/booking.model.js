import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
coach: { 
  type: mongoose.Schema.Types.ObjectId,
   ref: "User", 
  required: true 
},
  date: {
    type: Date,
    required: true,
  },
  timeStart: {
    type: String,
    required: true,
  },
  timeEnd: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  numbersOfMembers:{
    type:Number,
    default:1
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
