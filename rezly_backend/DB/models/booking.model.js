import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
coach: { 
  type: mongoose.Schema.Types.ObjectId,
   ref: "Employee", 
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
    description: { 
      type: String ,
      required:false

    },
createdBy:{
    type: mongoose.Schema.Types.ObjectId,
   ref: "Employee", 
  required: false 

},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  maxMembers:{
    type:Number,
    default:1
  },  
  recurrence: [{ type: String }],            // مثال: ["Mon", "Wed", "Fri"]
  reminders: [{ type: String }], 
subscriptionDuration: { type: String },
groupId: {
  type: String,
  index: true, // لتحسين البحث
},

});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
