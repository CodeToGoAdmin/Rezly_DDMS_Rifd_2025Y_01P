import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../../AppError.js";
import { sendEmail } from "../../Utils/sendEmail.js";
import { customAlphabet } from "nanoid";
import { arabicSlugify } from "../../Utils/ArabicSlug.js";
import mongoose from 'mongoose';

export const SignUp = async (req, res, next) => {
    const { userName, email, password, phone, gender, midicalIssue, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return next(new AppError('Email already exists', 409));

    const passwordHashed = await bcrypt.hash(password, parseInt(process.env.SALTROUND));

    const refreshToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '30d' });

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

       const token= jwt.sign({email},process.env.CONFIRMEMAILTOKEN);
       const confirmLink = `https://rezly-ddms-rifd-2025y-01p.onrender.com/auth/confirmEmail/${token}`;

console.log("Confirm link:", confirmLink); // اختبر بالكونسول
       await sendEmail(email,`confirm email from Booking `,userName,token)

        console.log("User created with refresh token:", newUser.refreshToken);
    return res.status(201).json({
        message: "success",
        user: newUser,
        refreshToken
    });
};

//confirmEmail function :future need the url to the log in page if needed
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.CONFIRMEMAILTOKEN);

    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true }
    );
console.log("confirmEmail is:", confirmEmail);
console.log("token is:", token);

    return res.status(200).json({ message: "success" });
    // أو إذا بدك تعمله redirect:
    // return res.redirect("https://your-frontend/login");
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};


// login function
export const SignIn = async (req, res, next) => {
    const { email, password } = req.body;

       const user = await userModel.findOne({ email }).select("+password");
        if (!user) return next(new AppError('Email not found', 404));

        // check if the user confirmed his email
        if (!user.confirmEmail) {
      return next(new AppError('please confirm your email', 409));  // 409 Conflict
 
        }
const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return next(new AppError('Invalid password', 401));
        }

        // إنشاء access token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.LOGINTOKEN,
            { expiresIn: '30m' }
        );

        // إنشاء refresh token جديد
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESHTOKEN_SECRET,
            { expiresIn: '30d' }
        );
        user.refreshToken = refreshToken;
              user.save().catch(err => console.error("Refresh token save failed:", err));


        return res.status(200).json({
         
            message: "SignIn success",
            token,
            refreshToken,
        });

    
};


// refresh token
export const refresh = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token is required', 401));
    }

    try {
        //console.log("Raw token received:", refreshToken);
       // console.log("Token length:", refreshToken.length);
        //console.log("Secret used:", process.env.REFRESHTOKEN_SECRET);

        const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
        //console.log("Decoded token:", decoded);

        const user = await userModel.findById(decoded.id);
        if (!user || !user.refreshToken) {
            //console.log("User not found or refresh token missing in DB");
            return next(new AppError('Invalid refresh token or user not found', 401));
        }

        // المقارنة مع trim لتجنب الفراغات
        if (user.refreshToken.trim() !== refreshToken.trim()) {
            //console.log("Token mismatch with DB");
            return next(new AppError('Invalid refresh token or user not found', 401));
        }

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.LOGINTOKEN,
            { expiresIn: '15m' }
        );

        //console.log("New access token generated successfully");

        return res.status(200).json({
            message: 'New access token granted',
            accessToken: newAccessToken
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Refresh token expired. Please log in again.', 401));
        }
        //console.error("Error in refresh token:", error);
        return next(new AppError(error.message, 401));
    }
};


// تسجيل الخروج
export const logout = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (user) {
      user.refreshToken = null;   // حذف refresh token من قاعدة البيانات
      await user.save();
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// sendcode function to the user email to confirm the properity
export const sendCode = async(req,res,next)=>{
    const {email}= req.body;
    const code= customAlphabet('1234567890',4)();
    const user= await userModel.findOneAndUpdate({email},{
      sendCode:code
    }
    ,{
      new:true
    });
    if (!user) {
      return next(new AppError('email not found', 409));
    }
    const subject = 'Reset Password';
    const username = user.userName || ''; // احصل على اسم المستخدم إذا كان موجودًا
    const token = code; // استخدام الكود كـ token هنا

    await sendEmail(email, subject, username, token,'sendCode');
    return res.status(200).json({message:"success"})
    
    }

    // forgetpassord function and resign it 
    export const forgotpassword = async(req,res,next)=>{
  const {email,password,code}=req.body;

  const user= await userModel.findOne({email});
  if(!user){
    return next(new AppError('email not found', 409));

  }

  if(user.sendCode != code){
    return next(new AppError('invalid code', 409));

  }
  user.password= bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
  user.sendCode=null;
  await user.save();
  return res.status(200).json({message:"success"});

}

