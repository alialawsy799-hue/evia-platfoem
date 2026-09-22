import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function buildEnrollmentMessage(input: {
  name: string;
  email: string;
  courseTitle: string;
  price?: number;
  discountCode?: string;
  finalPrice?: number;
}) {
  const lines = [
    "مرحباً إيفيا، أرغب بتفعيل اشتراكي:",
    `الاسم: ${input.name}`,
    `البريد: ${input.email}`,
    `الكورس: ${input.courseTitle}`,
  ];
  if (typeof input.price === "number") {
    lines.push(`السعر: ${formatPrice(input.price)}`);
  }
  if (input.discountCode) {
    lines.push(`كود الخصم: ${input.discountCode}`);
  }
  if (typeof input.finalPrice === "number" && input.discountCode) {
    lines.push(`السعر بعد الخصم: ${formatPrice(input.finalPrice)}`);
  }
  return lines.join("\n");
}

export function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function certificateWhatsappHref(input: {
  name: string;
  email: string;
  courseTitle: string;
}) {
  return whatsappHref(
    [
      "مرحباً دعم إيفيا، أكملت الكورس بنجاح وأرغب باستلام شهادتي الرسمية:",
      `الاسم: ${input.name}`,
      `البريد: ${input.email}`,
      `الكورس: ${input.courseTitle}`,
    ].join("\n"),
  );
}
