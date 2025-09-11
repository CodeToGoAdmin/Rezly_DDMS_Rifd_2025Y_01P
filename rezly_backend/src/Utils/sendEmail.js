import nodemailer from "nodemailer";
import { Emailtemplate } from "./EmailTemplate.js";
import {sendCodeTemplate} from "./sendCodeTemplate.js"

export async function sendEmail (to,subject,username='',token,templateType = ''){
    const transporter = nodemailer.createTransport({
       service:"gmail",
      
        auth: {
          user: process.env.EMAILSENDER,
          pass: process.env.PASSWORDSENDER,
        },
        tls:{
          rejectUnauthorized:false
        }
      });
      let htmlContent;

    // تحديد أي تمبلت سيتم استخدامه
    if (templateType === 'sendCode') {
        htmlContent = sendCodeTemplate(token); // استخدام تمبلت إعادة تعيين كلمة المرور
    } else {
        htmlContent = Emailtemplate(to,username,token); // استخدام تمبلت الترحيب
    }


      const info = await transporter.sendMail({
        from: `Booking website ^^" <${process.env.EMAILSENDER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        
        html:htmlContent
      });
}