import type { CourseCategory } from "@/lib/types";

export const COURSE_CATEGORIES: { id: CourseCategory | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "programming", label: "البرمجة" },
  { id: "marketing", label: "التسويق" },
  { id: "design", label: "التصميم" },
  { id: "languages", label: "اللغات" },
  { id: "drawing", label: "الرسم" },
  { id: "cybersecurity", label: "الأمن السيبراني" },
  { id: "data", label: "البيانات والذكاء الاصطناعي" },
  { id: "business", label: "الأعمال" },
  { id: "photography", label: "التصوير" },
  { id: "music", label: "العزف" },
];

export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  programming: "البرمجة",
  marketing: "التسويق",
  design: "التصميم",
  languages: "اللغات",
  drawing: "الرسم",
  cybersecurity: "الأمن السيبراني",
  data: "البيانات والذكاء الاصطناعي",
  business: "الأعمال",
  photography: "التصوير",
  music: "العزف",
};

export function isCourseCategory(value: string | null | undefined): value is CourseCategory {
  return Boolean(value && value in CATEGORY_LABELS);
}
