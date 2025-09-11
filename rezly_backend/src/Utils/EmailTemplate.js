// اعدل على الرابط بعد ما ارفع على ريندر وعلى جت هب 
export const Emailtemplate = (email, username, token) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد بريدك الإلكتروني</title>
    <style>
        /* استيراد خط Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');

        body {
            font-family: 'Tajawal', sans-serif;
            background-color: #f0f4f8; /* خلفية بلون رمادي فاتح */
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff; /* خلفية بيضاء نقية للمحتوى */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* ظل ناعم */
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        .header {
            background-color: #4a90e2; /* لون أزرق جذاب */
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .content {
            padding: 40px 30px;
            color: #333333;
            text-align: center;
        }

        .content p {
            margin: 15px 0;
            font-size: 16px;
        }

        .welcome-text {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 25px;
            color: #2c3e50; /* لون غامق للعناوين */
        }

        .button-container {
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #4a90e2; /* لون أزرق */
            color: #ffffff;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 700;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #357ABD; /* لون أزرق أغمق عند التمرير */
        }

        .footer {
            background-color: #f8fafc; /* خلفية أفتح للفوتر */
            color: #999999;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>أهلاً بك في خدماتنا!</h1>
        </div>
        
        <div class="content">
            <p class="welcome-text">مرحباً بك <strong>${username}</strong>،</p>
            <p>نحن سعداء بانضمامك إلينا، وشكراً لك على تسجيلك باستخدام البريد الإلكتروني: <br> <strong>${email}</strong>.</p>
            <p>يرجى تأكيد عنوان بريدك الإلكتروني بالضغط على الزر أدناه لإكمال عملية التسجيل.</p>

            <div class="button-container">


            


                <a href='https://project.onrender.com/auth/confirmEmail/${token}' class="button">تأكيد البريد الإلكتروني</a>
            </div>

            

            


            <p>إذا لم تكن أنت من قام بطلب التسجيل، يرجى تجاهل هذه الرسالة.</p>
        </div>
        
        <div class="footer">
            <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.</p>
            <p>&copy; ${new Date().getFullYear()} Our Service. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>`;
}

