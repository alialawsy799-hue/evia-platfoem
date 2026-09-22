export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  google_not_configured:
    "تسجيل الدخول عبر Google غير مُفعّل بعد. أضف GOOGLE_CLIENT_ID و GOOGLE_CLIENT_SECRET في ملف .env ثم أعد تشغيل المشروع.",
  google_denied: "تم إلغاء تسجيل الدخول عبر Google.",
  google_failed: "تعذر إكمال الدخول عبر Google. حاول مرة أخرى.",
  missing_email: "حساب Google لا يحتوي على بريد إلكتروني صالح.",
};

export function authErrorMessage(code: string | null | undefined) {
  if (!code) return "";
  return AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES.google_failed;
}
