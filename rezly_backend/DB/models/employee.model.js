 import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },         
  lastName: { type: String, required: true },           
  birthDate: { type: Date, required: true },           
  profileImage: { type: String },                       
  nationalId: { type: String, required: true, unique: true }, 
  gender: { type: String, enum: ["ذكر", "أنثى"], required: true }, 
  phoneNumber: { type: String, required: true },      
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },           
  jobTitle: { type: String, required: true },          
  department: { type: String, required: true },       
  contractType: { type: String, enum: ["دوام كامل", "دوام جزئي", "عقد مؤقت"], required: true }, // نوع العقد
  startDate: { type: Date, required: true },           
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },           
  role: { type: String,
       enum: ["Admin", "Coach", "accountant", "receptionist"],
 required: true },
  notes: { type: String } ,
    confirmEmail: { type: Boolean, default: false },
  refreshToken: { type: String },                             
}, { timestamps: true });

export const Employee = mongoose.model("Employee", employeeSchema);
