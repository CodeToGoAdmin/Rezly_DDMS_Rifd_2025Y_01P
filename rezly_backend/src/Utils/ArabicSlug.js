export function arabicSlugify(text) {
    // مثال على كيفية تحويل النص إلى slug
    return text
        .toLowerCase() // تحويل النص إلى حروف صغيرة
        .replace(/[^أ-يa-z0-9]+/g, '-') // إزالة الأحرف غير المسموح بها
        .replace(/^-|-$/g, ''); // إزالة الداش في البداية والنهاية
}
