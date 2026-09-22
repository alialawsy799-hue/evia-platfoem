export const SITE = {
  name: "EVIA",
  nameAr: "إيفيا",
  domain: "evia.com",
  tagline: "تعلم بلا حدود، المستقبل بين يديك",
  description:
    "تعلم بلا حدود، المستقبل بين يديك. منصة إيفيا تجمع الكورسات الاحترافية، المسارات العملية، والمجتمع في تجربة زجاجية حديثة.",
} as const;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966500000000";

export const ALLOWED_EMBED_DOMAINS = (
  process.env.NEXT_PUBLIC_VIMEO_ALLOWED_DOMAINS ?? "evia.com,localhost"
).split(",");

export const NAV_LINKS = [
  { href: "/courses", label: "الكورسات" },
  { href: "/instructors", label: "المدرسين" },
  { href: "/paths", label: "مسارات التعلم" },
  { href: "/#faq", label: "الأسئلة" },
  { href: "/#pricing", label: "الأسعار" },
  { href: "/community", label: "المجتمع" },
] as const;

export const STUDENT_NAV = [
  { href: "/dashboard", label: "لوحة التعلّم" },
  { href: "/courses", label: "الكورسات" },
  { href: "/instructors", label: "المدرسين" },
  { href: "/paths", label: "مسارات التعلم" },
  { href: "/community", label: "المجتمع" },
] as const;

export const INSTRUCTOR_NAV = [
  { href: "/instructor", label: "لوحة المدرّس" },
  { href: "/courses", label: "الكورسات" },
  { href: "/instructors", label: "المدرسين" },
  { href: "/paths", label: "مسارات التعلم" },
] as const;
