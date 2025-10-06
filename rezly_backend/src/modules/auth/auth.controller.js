import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../../AppError.js";
import { sendEmail } from "../../Utils/sendEmail.js";
import { customAlphabet } from "nanoid";
import { arabicSlugify } from "../../Utils/ArabicSlug.js";
import mongoose from 'mongoose';
import { employeeSchema } from "./auth.validation.js";
import { Employee } from "../../../DB/models/employee.model.js";

import crypto from "crypto";

export const employeeSignUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      nationalId,
      gender,
      phoneNumber,
      email,
      address,
      jobTitle,
      department,
      contractType,
      startDate,
      username,
      password,
      role,
      notes,
    } = req.body;
    console.log("fhbfhjvbhjgvf");
    
    const { error } = employeeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.map((e) => e.message),
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESHTOKEN_SECRET,
      { expiresIn: "30d" }
    );

    const emailToken = jwt.sign(
      { email },
      process.env.CONFIRMEMAILTOKEN,
      { expiresIn: "1h" }
    );

    // ===== معالجة الصورة (تشفر وتخزن كـ Base64) =====
    let encryptedImage = "";
 
if (req.file) {
  const key = Buffer.from(process.env.IMAGE_ENCRYPTION_KEY, "hex"); // لازم تكون 32 بايت (64 رمز hex)
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(req.file.buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  encryptedImage = {
    data: encrypted.toString("base64"),
    iv: iv.toString("hex"),
    mimetype: req.file.mimetype,
  };
}
    const newEmployee = new Employee({
      firstName,
      lastName,
      birthDate,
      image: encryptedImage,
      nationalId,
      gender,
      phoneNumber,
      email,
      address,
      jobTitle,
      department,
      contractType,
      startDate,
      username,
      password: hashedPassword,
      role,
      notes,
      confirmEmail: false,
      refreshToken,
    });

    await newEmployee.save();

       const confirmLink = `https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/confirmEmail/${emailToken}`;
        console.log("Confirm link:", confirmLink); // لا يزال للـ testing

        await sendEmail(email, `confirm email from Booking`, username, emailToken);

        console.log("User created with refresh token:", newEmployee.refreshToken);

    res.status(201).json({
      message:
        "تم إنشاء الحساب بنجاح، يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل.",
    });
  } catch (error) {
    console.error(error);

    // ===== معالجة أخطاء التكرار =====
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      let message = "";

      switch (field) {
        case "username":
          message = "اسم المستخدم موجود بالفعل";
          break;
        case "email":
          message = "البريد الإلكتروني مستخدم بالفعل";
          break;
        case "nationalId":
          message = "رقم الهوية مستخدم بالفعل";
          break;
        default:
          message = "قيمة مكررة في أحد الحقول";
      }

      return res.status(400).json({ errors: [message] });
    }

    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الحساب",
      error,
    });
  }
};
export const getAllEmployees = async (req,res) => {
  try {
    const { role } = req.query;

    // بناء شرط البحث
    const query = role ? { role } : {};

    const employees = await Employee.find(query, {
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      email: 1,
      department: 1,
      jobTitle: 1
    });

    const totalCount = employees.length;

    res.status(200).json({ totalCount, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "فشل في جلب بيانات الموظفين", error: error.message });
  }
};
export const toggleEmployeeStatus = async (req, res) => {
  try {
    const { id, active } = req.query; // الاثنين من الكويري

    if (!id) {
      return res.status(400).json({ message: "لم يتم إرسال رقم الموظف (id)" });
    }

    if (active === undefined) {
      return res.status(400).json({ message: "لم يتم تحديد حالة الحساب (active)" });
    }

    // نحول القيمة من string إلى Boolean
    const isActive = active === "true";

    // تحديث الحالة
    const employee = await Employee.findByIdAndUpdate(
      id,
  { active: isActive },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "الموظف غير موجود" });
    }

    res.status(200).json({
      message: `تم ${isActive ? "تفعيل" : "تعطيل"} الحساب بنجاح`,
      employee,
    });
  } catch (err) {
    console.error("Error updating employee status:", err);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث حالة الحساب",
      error: err.message,
    });
  }
};

export const SignUp = async (req, res, next) => {
    try {
        const { userName, email, password, phone, gender, midicalIssue, role } = req.body;

        // تحقق من وجود المستخدم مع استخدام projection أصغر لتسريع الاستعلام
        const existingUser = await userModel.findOne({ email }).lean();
        if (existingUser) return next(new AppError('Email already exists', 409));

        const passwordHashed = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

        const refreshToken = jwt.sign(
            { id: new mongoose.Types.ObjectId() },
            process.env.REFRESHTOKEN_SECRET,
            { expiresIn: '30d' }
        );

        const newUser = await userModel.create({
            userName,
            email,
            password: passwordHashed,
            phone,
            gender,
            midicalIssue,
            role,
            slug: arabicSlugify(`${userName.trim()}-${new mongoose.Types.ObjectId()}`),
            refreshToken
        });

        // أضف expiresIn لتوكن تأكيد الإيميل لتحسين الأمان
        const token = jwt.sign(
            { email },
            process.env.CONFIRMEMAILTOKEN,
            { expiresIn: '1h' }  // صلاحية ساعة واحدة
        );

        const confirmLink = `https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/confirmEmail/${token}`;
        console.log("Confirm link:", confirmLink); // لا يزال للـ testing

        await sendEmail(email, `confirm email from Booking`, userName, token);

        console.log("User created with refresh token:", newUser.refreshToken);

        return res.status(201).json({
            message: "success",
            user: newUser,
            refreshToken
        });
    } catch (error) {
        next(error);
    }
};

export const confirmEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);

        const updatedUser = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { confirmEmail: true },
            { new: true, lean: true }  // lean لتحسين الأداء
        );

        if (!updatedUser) {
            return next(new AppError("User not found", 404));
        }

        console.log("Email confirmed:", decoded.email);
        console.log("Token used:", token);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};

export const SignIn = async (req, res, next) => {
  try {
    const { identifier, password ,rememberMe} = req.body; // identifier = email or username

    if (!identifier || !password) {
      return next(new AppError("Username/Email and Password are required", 400));
    }

    // البحث في جدول المستخدمين أولاً
    let user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select("password refreshToken role _id confirmEmail").lean();

    let source = "user"; // لتحديد مصدر البحث

    // إذا ما لقينا المستخدم، جرب البحث في جدول الموظفين
    if (!user) {
      user = await Employee.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      }).select("password refreshToken role _id confirmEmail").lean();
      source = "employee";
    }

    if (!user) return next(new AppError('Email/Username not found', 404));

    if (!user.confirmEmail) {
      return next(new AppError('Please confirm your email', 409));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new AppError('Invalid password', 401));

   const token = jwt.sign(
  { id: user._id, role: user.role, source },
  process.env.LOGINTOKEN,
  { expiresIn: rememberMe ? '7d' : '30m' }
);

const refreshToken = jwt.sign(
  { id: user._id },
  process.env.REFRESHTOKEN_SECRET,
  { expiresIn: rememberMe ? '30d' : '7d' }
);

    // تحديث refresh token في DB
    const ModelToUpdate = source === "user" ? userModel : Employee;
    await ModelToUpdate.findByIdAndUpdate(user._id, { refreshToken });

    return res.status(200).json({
      message: "SignIn success",
      token,
      refreshToken,
      role: user.role,
      source, // لمعرفة هل هو user أو employee
    });

  } catch (error) {
    next(error);
  }
};

// refresh token
export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(new AppError('Refresh token is required', 401));
        }

        // تحقق من صحة الـ refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);

        // جلب المستخدم مع الحقول الضرورية فقط
        const user = await userModel.findById(decoded.id)
            .select("refreshToken role _id")
            .lean();

        if (!user || !user.refreshToken) {
            return next(new AppError('Invalid refresh token or user not found', 401));
        }

        // المقارنة مع trim لتجنب الفراغات
        if (user.refreshToken.trim() !== refreshToken.trim()) {
            return next(new AppError('Invalid refresh token or user not found', 401));
        }

        // إنشاء access token جديد
        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.LOGINTOKEN,
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            message: 'New access token granted',
            accessToken: newAccessToken
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Refresh token expired. Please log in again.', 401));
        }
        return next(new AppError(error.message, 401));
    }
};
// تسجيل الخروج
export const logout = async (req, res, next) => {
  try {
    // تحديث refreshToken مباشرة بدون الحاجة لجلب كامل المستخدم
    const result = await userModel.findByIdAndUpdate(req.userId, { refreshToken: null });
    if (!result) {
      return next(new AppError("User not found", 404));
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// sendCode function to the user email to confirm the property
export const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const code = customAlphabet('1234567890', 4)();

    const user = await userModel.findOneAndUpdate(
      { email },
      { sendCode: code },
      { new: true, lean: true } // lean لتحسين الأداء
    );

    if (!user) {
      return next(new AppError('Email not found', 409));
    }

    const subject = 'Reset Password';
    const username = user.userName || '';
    const token = code; // استخدام الكود كـ token هنا

    await sendEmail(email, subject, username, token, 'sendCode');
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

// forgotPassword function
export const forgotpassword = async (req, res, next) => {
  try {
    const { email, password, code } = req.body;

    // جلب المستخدم مع الحقول الضرورية فقط
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError('Email not found', 409));
    }

    if (user.sendCode !== code) {
      return next(new AppError('Invalid code', 409));
    }

    // hash بشكل async لتجنب blocking
    user.password = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    user.sendCode = null;

    await user.save();
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

