export function arabicSlugify(text) {
    return text
        .trim()                  // إزالة الفراغات من البداية والنهاية
        .replace(/\s+/g, '-')    // تحويل الفراغات الداخلية لشرطة
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]+/g, '') // إزالة أي رموز غير مسموح بها
        .replace(/^-+|-+$/g, ''); // إزالة الشرطة في البداية والنهاية
}
