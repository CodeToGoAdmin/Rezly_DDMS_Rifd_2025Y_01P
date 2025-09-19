import nodemailer from "nodemailer";
import { Emailtemplate } from "./EmailTemplate.js";
import { sendCodeTemplate } from "./sendCodeTemplate.js";

export async function sendEmail(to, subject, username = "", token = "", templateType = "") {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,        
      port: process.env.EMAIL_PORT,        
      secure: process.env.EMAIL_SECURE === "true", 
      auth: {
        user: process.env.EMAILSENDER,     
        pass: process.env.PASSWORDSENDER   
      },
      tls: {
        rejectUnauthorized: false          
      }
    });

    // اختيار التمبلت المناسب
    let htmlContent;
    if (templateType === "sendCode") {
      htmlContent = sendCodeTemplate(token);
    } else {
      htmlContent = Emailtemplate(to, username, token);
    }

    // إرسال الإيميل
    const info = await transporter.sendMail({
      from: `Rezly Support <${process.env.EMAILSENDER}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log("Email sent successfully:", info.messageId);
    return info;

  } catch (error) {
    console.error("Error sending email:", error.message);

    if (process.env.EMAIL_PORT === "465") {
      console.log("Retrying with port 587 (non-secure)...");
      try {
        let transporter587 = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAILSENDER,
            pass: process.env.PASSWORDSENDER
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const info = await transporter587.sendMail({
          from: `Rezly Support <${process.env.EMAILSENDER}>`,
          to,
          subject,
          html: templateType === "sendCode"
            ? sendCodeTemplate(token)
            : Emailtemplate(to, username, token)
        });

        console.log("Email sent successfully with port 587:", info.messageId);
        return info;

      } catch (retryError) {
        console.error("Retry with port 587 failed:", retryError.message);
        throw retryError;
      }
    }

    throw error;
  }
}
