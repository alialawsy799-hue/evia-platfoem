import type { CatalogState, Course, Instructor, Profile } from "@/lib/types";

const DEMO_VIMEO = "76979871";
const iqd = (amount: number) => amount * 1000;

export const DEMO_PROFILES: Profile[] = [
  {
    id: "student-ahmed",
    email: "ahmed@evia.com",
    fullName: "أحمد الراشد",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    role: "student",
    joinedAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "instructor-eyad",
    email: "eyad@evia.com",
    fullName: "إياد محمود",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    role: "instructor",
    joinedAt: "2025-11-03T09:00:00.000Z",
  },
  {
    id: "admin-evia",
    email: "admin@evia.com",
    fullName: "إدارة إيفيا",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "admin",
    joinedAt: "2025-09-01T08:00:00.000Z",
  },
];

export const DEMO_PASSWORDS: Record<string, string> = {
  "ahmed@evia.com": "123456",
  "eyad@evia.com": "123456",
};

export const REMOVED_SEED_INSTRUCTOR_IDS = [
  "ins-eyad",
  "ins-sara",
  "ins-nasser",
  "ins-layla",
  "ins-karim",
  "ins-maha",
  "ins-yousef",
  "ins-adel",
  "ins-raneen",
  "ins-meta",
] as const;

export const SEED_INSTRUCTORS: Instructor[] = [
  {
    id: "ins-baraa",
    name: "براء عبد الرحمن",
    title: "مدرّبة برمجة",
    avatarUrl: "/uploads/instructors/baraa-abdulrahman.jpg",
    bio: "مطوّرة ومدرّبة برمجة، يجمع الخبرة العملية والخلفية الأكاديمية لتبسيط المفاهيم ومساعدة المبتدئين على بناء تطبيقاتهم باستخدام الذكاء الاصطناعي",
    yearsExperience: 6,
    specialties: ["تطوير التطبيقات", "لغة البايثون", "الذكاء الاصطناعي"],
    balance: 0,
    pendingBalance: 0,
  },
  {
    id: "ins-ali-awsi",
    name: "دكتور علي الاوسي",
    title: "مدرّب تطوير الويب",
    avatarUrl: "/uploads/instructors/ali-alawsi.jpg",
    bio: "يجمع بين الخبرة البرمجية العملية والخلفية الأكاديمية المتينة، ليحول أعتى مفاهيم تطوير الويب إلى خطوات مبسطة وتطبيقية. ينقلك بأسلوب سلس ومباشر من مرحلة فهم الأساسيات إلى احتراف بناء مشاريع كاملة بواجهات حديثة وبنية برمجية قوية.",
    yearsExperience: 9,
    specialties: ["تطوير الويب"],
    balance: 0,
    pendingBalance: 0,
  },
  {
    id: "ins-ibaa",
    name: "إباء محمد",
    title: "مدرّبة لغة تركية",
    avatarUrl: "/uploads/instructors/ibaa-mohammed-v2.jpg",
    bio: "أستاذة لغة تركية كفوءة، تجمع بين الطلاقة والسلاسة في الشرح لتقرّب اللغة من الطالب خطوة بخطوة. بأسلوب واضح وعملي تبني أساساً قوياً في المحادثة والقواعد والنطق، حتى يصبح التواصل بالتركية أمراً طبيعياً في الحياة اليومية.",
    yearsExperience: 5,
    specialties: ["اللغة التركية"],
    balance: 0,
    pendingBalance: 0,
  },
  {
    id: "ins-ahmed-karim",
    name: "الأستاذ أحمد كريم",
    title: "مدرّب إعلانات ميتا بزنس",
    avatarUrl: "",
    bio: "مدرب متخصص في إعلانات ميتا بزنس، يبسّط بناء الحملات على فيسبوك وإنستغرام من تحديد الجمهور والميزانية حتى قراءة النتائج وتحسين الأداء. يعتمد أسلوباً عملياً واضحاً ليخرج الطالب قادراً على إطلاق حملات ترويج قابلة للقياس.",
    yearsExperience: 5,
    specialties: ["إعلانات ميتا", "ميتا بزنس", "الترويج"],
    balance: 0,
    pendingBalance: 0,
  },
];

function lesson(
  id: string,
  title: string,
  description: string,
  durationMinutes: number,
  order: number,
): Course["modules"][number]["lessons"][number] {
  return {
    id,
    title,
    description,
    durationMinutes,
    vimeoId: DEMO_VIMEO,
    order,
  };
}

const LIVE_COURSE_ID = "frontend-mastery";

const BASE_SEED_COURSES: Course[] = [
  {
    id: "frontend-mastery",
    slug: "frontend-mastery",
    title: "تطوير الويب",
    subtitle: "ابنِ منتجات عربية حديثة بـ React و Next.js",
    description:
      "مسار عملي كامل لبناء واجهات سريعة، آمنة، ومتوافقة مع RTL — من أساسيات التصميم إلى نشر منتج حقيقي.",
    thumbnailUrl: "/uploads/courses/web-development.jpg",
    instructorId: "ins-ali-awsi",
    introVimeoId: DEMO_VIMEO,
    price: iqd(100),
    salePrice: iqd(70),
    durationHours: 40,
    studentCount: 4120,
    rating: 4.9,
    level: "متوسط",
    category: "programming",
    isPublished: true,
    modules: [
      {
        id: "fe-m1",
        title: "حلقات الكورس",
        order: 1,
        lessons: [
          lesson("fe-l1", "مقدمة عن الكورس", "تعريف بمسار مطور المواقع وما ستبنيه خلال الحلقات.", 12, 1),
          lesson("fe-l2", "الشهادة وكروب التكرام", "طريقة الحصول على الشهادة والانضمام لكروب التلكرام.", 10, 2),
          lesson("fe-l3", "اساسيات الكورس", "الأساسيات التي تحتاجها قبل البدء ببناء المشروع.", 24, 3),
          lesson("fe-l4", "مرحلة بناء الموقع + بناء حاسبة", "بناء الموقع خطوة بخطوة مع تطبيق الحاسبة.", 40, 4),
          lesson("fe-l5", "بناء متجر الكتروني", "تنفيذ متجر إلكتروني عملي ضمن مسار مطور المواقع.", 45, 5),
        ],
      },
    ],
  },
  {
    id: "app-development",
    slug: "app-development",
    title: "تطوير التطبيقات",
    subtitle: "ابنِ تطبيقك خطوة بخطوة مع الذكاء الاصطناعي",
    description:
      "مسار عملي لبناء التطبيقات من الفكرة إلى منتج يعمل، مع تبسيط المفاهيم ومساعدة المبتدئين على التنفيذ باستخدام أدوات الذكاء الاصطناعي.",
    thumbnailUrl: "/uploads/courses/app-development.jpg",
    instructorId: "ins-baraa",
    introVimeoId: DEMO_VIMEO,
    price: 0,
    salePrice: null,
    durationHours: 24,
    studentCount: 0,
    rating: 5,
    level: "مبتدئ",
    category: "programming",
    isPublished: true,
    modules: [
      {
        id: "app-m1",
        title: "من الفكرة إلى التطبيق",
        order: 1,
        lessons: [
          lesson("app-l1", "كيف نفكر في التطبيق", "تحويل الفكرة إلى شاشات ووظائف واضحة.", 14, 1),
          lesson("app-l2", "أول واجهة", "بناء شاشة أساسية يمكن تطويرها لاحقاً.", 18, 2),
        ],
      },
    ],
  },
  {
    id: "turkish-language",
    slug: "turkish-language",
    title: "اللغة التركية",
    subtitle: "تعلّم التركية بطلاقة من الأساسيات إلى المحادثة",
    description:
      "مسار عملي لتعلّم اللغة التركية من الصفر: النطق الصحيح، المفردات اليومية، القواعد المبسّطة، وبناء ثقة المحادثة في المواقف الحقيقية.",
    thumbnailUrl: "/uploads/courses/cover-turkish.jpg",
    instructorId: "ins-ibaa",
    introVimeoId: DEMO_VIMEO,
    price: 0,
    salePrice: null,
    durationHours: 20,
    studentCount: 0,
    rating: 5,
    level: "مبتدئ",
    category: "languages",
    isPublished: true,
    modules: [
      {
        id: "tr-m1",
        title: "البداية مع التركية",
        order: 1,
        lessons: [
          lesson("tr-l1", "مرحباً بالتركية", "التعارف والتحيات والجمل الأولى.", 14, 1),
          lesson("tr-l2", "الحروف والنطق", "الأصوات التركية ونطقها بوضوح.", 18, 2),
        ],
      },
    ],
  },
  {
    id: "meta-ads",
    slug: "meta-ads",
    title: "إعلانات ميتا",
    subtitle: "الترويج عبر فيسبوك وإنستغرام",
    description:
      "تعلّم بناء حملات إعلانات ميتا من الصفر: تحديد الجمهور، إعداد الميزانية، صناعة الإعلان، وقراءة النتائج لتحسين الترويج خطوة بخطوة.",
    thumbnailUrl: "/uploads/courses/meta-ads.jpg",
    instructorId: "ins-ahmed-karim",
    introVimeoId: DEMO_VIMEO,
    price: 0,
    salePrice: null,
    durationHours: 18,
    studentCount: 0,
    rating: 5,
    level: "مبتدئ",
    category: "marketing",
    isPublished: true,
    modules: [
      {
        id: "meta-m1",
        title: "أساسيات الترويج",
        order: 1,
        lessons: [
          lesson("meta-l1", "مقدمة عن إعلانات ميتا", "فهم فيسبوك وإنستغرام كمنصات ترويج.", 16, 1),
          lesson("meta-l2", "بناء أول حملة", "اختيار الهدف والجمهور والميزانية.", 22, 2),
          lesson("meta-l3", "قراءة النتائج", "تحليل الوصول والتحويلات وتحسين الإعلان.", 20, 3),
        ],
      },
    ],
  },
];

export const SEED_COURSES: Course[] = BASE_SEED_COURSES.map((course) =>
  course.id === LIVE_COURSE_ID
    ? { ...course, comingSoon: false }
    : { ...course, comingSoon: true, price: 0, salePrice: null },
);

export function createSeedState(): CatalogState {
  return {
    instructors: SEED_INSTRUCTORS,
    courses: SEED_COURSES,
    enrollments: [
      {
        id: "enr-1",
        userId: "student-ahmed",
        courseId: "frontend-mastery",
        grantedBy: "admin-evia",
        createdAt: new Date().toISOString(),
      },
    ],
    lessonProgress: [
      {
        userId: "student-ahmed",
        lessonId: "fe-l1",
        completedAt: new Date().toISOString(),
      },
      {
        userId: "student-ahmed",
        lessonId: "fe-l2",
        completedAt: new Date().toISOString(),
      },
    ],
    quizAttempts: [],
    payouts: [],
    profiles: DEMO_PROFILES,
    discountCodes: [],
    instructorAccounts: [],
    studentAccounts: [],
    authSessions: [],
    monthlyReceipts: [],
  };
}
