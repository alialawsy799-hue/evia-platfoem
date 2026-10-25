import {
  getEffectivePrice,
  type Course,
  type DiscountCode,
  type Enrollment,
} from "@/lib/types";

export function normalizeDiscountCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function applyDiscountAmount(
  basePrice: number,
  coupon: Pick<DiscountCode, "type" | "value">,
) {
  if (coupon.type === "percent") {
    const percent = Math.min(100, Math.max(0, coupon.value));
    return Math.max(0, Math.round(basePrice * (1 - percent / 100)));
  }
  return Math.max(0, Math.round(basePrice - Math.max(0, coupon.value)));
}

export function formatDiscountValue(coupon: Pick<DiscountCode, "type" | "value">) {
  if (coupon.type === "percent") return `${coupon.value}%`;
  return `${coupon.value} د.ع`;
}

export function isUgcCoupon(coupon: Pick<DiscountCode, "channel">) {
  return coupon.channel === "ugc";
}

export function uniqueStudentsForCoupon(
  coupon: Pick<DiscountCode, "code" | "usedByUserIds">,
  enrollments: Enrollment[],
) {
  const code = coupon.code;
  const fromEnrollments = enrollments
    .filter((item) => item.discountCode && normalizeDiscountCode(item.discountCode) === code)
    .map((item) => item.userId);
  return Array.from(new Set([...(coupon.usedByUserIds ?? []), ...fromEnrollments]));
}

export type AppliedDiscount = {
  ok: true;
  coupon: DiscountCode;
  originalPrice: number;
  finalPrice: number;
  savings: number;
};

export type DiscountEvalResult =
  | AppliedDiscount
  | { ok: false; error: string };

export function evaluateDiscountCode(
  codes: DiscountCode[],
  rawCode: string,
  course: Pick<Course, "id" | "price" | "salePrice">,
  now = new Date(),
): DiscountEvalResult {
  const normalized = normalizeDiscountCode(rawCode);
  if (!normalized) return { ok: false, error: "أدخل كود الخصم" };

  const coupon = codes.find((item) => item.code === normalized);
  if (!coupon) return { ok: false, error: "كود الخصم غير صحيح" };
  if (!coupon.isActive) return { ok: false, error: "هذا الكود غير مفعّل حالياً" };
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now.getTime()) {
    return { ok: false, error: "انتهت صلاحية هذا الكود" };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, error: "تم استهلاك الحد الأقصى لهذا الكود" };
  }
  if (coupon.courseIds.length > 0 && !coupon.courseIds.includes(course.id)) {
    return { ok: false, error: "هذا الكود غير صالح لهذا الكورس" };
  }

  const originalPrice = getEffectivePrice(course);
  const finalPrice = applyDiscountAmount(originalPrice, coupon);
  return {
    ok: true,
    coupon,
    originalPrice,
    finalPrice,
    savings: Math.max(0, originalPrice - finalPrice),
  };
}
