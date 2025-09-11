import mongoose from "mongoose";

const bookingMemberSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const BookingMember = mongoose.model("BookingMember", bookingMemberSchema);
export default BookingMember;
