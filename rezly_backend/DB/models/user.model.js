import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 4,
      max: 20,
      unique: true,
      trim: true,
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    gender: {
      type: String,
      enum: ["ذكر", "أنثى"],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    birthDate: {
      type: Date,
    },

    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^05\d{8}$/.test(v);
        },
        message: "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام",
      },
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    address: {
      type: String,
    },

    jobTitle: {
      type: String,
      enum: [
        "مدير",
        "رئيس قسم",
        "موظف استقبال",
        "محاسب",
        "مدرب",
        "عامل نظافة",
      ],
    },

    contractType: {
      type: String,
      enum: ["دوام جزئي", "دوام كلي"],
    },

    startDate: {
      type: Date,
    },

    // نهاية العقد
    endDate: {
      type: Date,
    },

  
    paymentStatus: {
      type: String,
      enum: ["مدفوع", "غير مدفوع", "قيد المعالجة"],
      default: "غير مدفوع",
    },

    //
    subscriptionStatus: {
      type: String,
      enum: ["Active", "Expired", "Frozen"],
      default: "Active",
    },

    // 🆕 الموظف المسؤول (اللي أضاف هذا المستخدم)
    responsibleEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    image: {
      type: Object,
    },



    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      default: "Active",
      enum: ["Active", "NotActive"],
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    midicalIssue: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    slug: {
      type: String,
    },

    sendCode: {
      type: String,
      default: null,
    },
     roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },

},


  { timestamps: true }
)
const userModel = model("User", userSchema);
export default userModel;