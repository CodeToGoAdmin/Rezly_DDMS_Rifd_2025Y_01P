export const sendCodeTemplate = (code) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');

        body {
            font-family: 'Tajawal', sans-serif;
            background-color: #f7f9fc; /* لون خلفية أبيض مائل للرمادي */
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 500px;
            background-color: #ffffff; /* لون خلفية أبيض نقي */
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* ظل أنعم */
            padding: 40px;
            text-align: center;
            border: 1px solid #e0e6ed;
        }
        .header {
            color: #2c3e50; /* لون نص غامق */
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db; /* خط أزرق تحت العنوان */
            padding-bottom: 10px;
            display: inline-block;
        }
        .content p {
            color: #555;
            line-height: 1.6;
            margin: 15px 0;
        }
        .code-box {
            background-color: #f1f4f8; /* لون خلفية خفيف للرمز */
            padding: 15px 25px;
            border-radius: 8px;
            margin: 30px auto;
            display: inline-block;
            border: 1px dashed #c0c9d7;
        }
        .code {
            color: #3498db; /* لون أزرق جذاب */
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
        }
        .note {
            color: #999;
            font-size: 14px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            إعادة تعيين كلمة المرور
        </div>
        <div class="content">
            <p>مرحباً،</p>
            <p>الرجاء استخدام الرمز أدناه لإعادة تعيين كلمة المرور الخاصة بك.</p>
            
            <div class="code-box">
                <span class="code">${code}</span>
            </div>

            <p>هذا الرمز صالح لمدة قصيرة. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.</p>
        </div>
        <p class="note">شكراً لك،<br>فريق الدعم</p>
    </div>
</body>
</html>`;
}

