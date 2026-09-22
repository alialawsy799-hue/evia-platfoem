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
    id: "applied-ai",
    slug: "applied-ai",
    title: "الذكاء الاصطناعي التطبيقي",
    subtitle: "من الفكرة إلى نموذج يعمل في منتج حقيقي",
    description:
      "تعلّم بناء تطبيقات ذكاء اصطناعي عملية: هندسة الأوامر، التقييم، والدمج الآمن داخل تجربة المستخدم.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-sara",
    introVimeoId: DEMO_VIMEO,
    price: iqd(149),
    salePrice: null,
    durationHours: 36,
    studentCount: 2870,
    rating: 4.9,
    level: "متقدم",
    category: "data",
    isPublished: true,
    modules: [
      {
        id: "ai-m1",
        title: "أسس النماذج اللغوية",
        order: 1,
        lessons: [
          lesson("ai-l1", "كيف يفكر النموذج", "مدخل عملي للسياق والتوكنز.", 20, 1),
          lesson("ai-l2", "هندسة الأوامر للعربية", "أنماط واضحة للنصوص العربية.", 26, 2),
        ],
        quiz: {
          id: "ai-q1",
          title: "اختبار الأسس",
          passingScore: 70,
          questions: [
            {
              id: "ai-q1-1",
              question: "أفضل وصف لهندسة الأوامر:",
              options: ["تخمين عشوائي", "تصميم تعليمات قابلة للقياس", "تعطيل النموذج", "ترجمة حرفية"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "cyber-defense",
    slug: "cyber-defense",
    title: "الأمن السيبراني الدفاعي",
    subtitle: "احمِ منتجاتك ومسارات التعلّم من التهديدات",
    description:
      "مسار دفاعي يركز على حماية المحتوى، الهوية، والبنية — بدون أي محتوى هجومي.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-nasser",
    introVimeoId: DEMO_VIMEO,
    price: iqd(129),
    salePrice: iqd(99),
    durationHours: 32,
    studentCount: 1980,
    rating: 4.8,
    level: "متوسط",
    category: "cybersecurity",
    isPublished: true,
    modules: [
      {
        id: "cy-m1",
        title: "حماية المحتوى الرقمي",
        order: 1,
        lessons: [
          lesson("cy-l1", "تقييد النطاق والتضمين", "إعدادات الخصوصية لمنصات الفيديو.", 16, 1),
          lesson("cy-l2", "علامات مائية ديناميكية", "تتبع التسريب دون تعطيل التجربة.", 22, 2),
        ],
        quiz: {
          id: "cy-q1",
          title: "اختبار الحماية",
          passingScore: 70,
          questions: [
            {
              id: "cy-q1-1",
              question: "الهدف من العلامة المائية الديناميكية:",
              options: ["تجميل الفيديو", "ربط المشاهدة بهوية الطالب", "رفع السعر", "حذف الدروس"],
              correctIndex: 1,
            },
          ],
        },
      },
    ],
  },
  {
    id: "ux-craft",
    slug: "ux-craft",
    title: "تصميم تجربة المستخدم",
    subtitle: "من البحث إلى واجهة زجاجية آسرة",
    description:
      "كورس بصري لبناء تجارب عربية راقية: تدفق، تباين، وحركة ناعمة دون ضوضاء.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-eyad",
    introVimeoId: DEMO_VIMEO,
    price: iqd(89),
    salePrice: null,
    durationHours: 24,
    studentCount: 3340,
    rating: 4.9,
    level: "مبتدئ",
    category: "design",
    isPublished: true,
    modules: [
      {
        id: "ux-m1",
        title: "أسس التجربة",
        order: 1,
        lessons: [
          lesson("ux-l1", "التسلسل البصري", "كيف تقود العين في واجهة عربية.", 14, 1),
          lesson("ux-l2", "الزجاج والتوهج", "استخدام الضباب والضوء بحدود أنيقة.", 19, 2),
        ],
      },
    ],
  },
  {
    id: "data-science",
    slug: "data-science",
    title: "علم البيانات",
    subtitle: "حوّل الأرقام إلى قرارات واضحة",
    description:
      "تعلّم جمع البيانات، تنظيفها، وتصويرها لبناء لوحات قياس يفهمها صانع القرار.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-sara",
    introVimeoId: DEMO_VIMEO,
    price: iqd(119),
    salePrice: iqd(89),
    durationHours: 38,
    studentCount: 2210,
    rating: 4.8,
    level: "متوسط",
    category: "data",
    isPublished: true,
    modules: [
      {
        id: "ds-m1",
        title: "رحلة البيانات",
        order: 1,
        lessons: [
          lesson("ds-l1", "من السؤال إلى المؤشر", "صياغة أسئلة قابلة للقياس.", 17, 1),
          lesson("ds-l2", "تصوير هادئ", "لوحات داكنة عالية الوضوح.", 21, 2),
        ],
      },
    ],
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "التسويق الرقمي",
    subtitle: "ابنِ علامة تعليمية يحبها الجمهور",
    description:
      "استراتيجيات محتوى، نمو عضوي، وقياس أثر الحملات للمنتجات التعليمية العربية.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-nasser",
    introVimeoId: DEMO_VIMEO,
    price: iqd(79),
    salePrice: null,
    durationHours: 22,
    studentCount: 5120,
    rating: 4.7,
    level: "مبتدئ",
    category: "marketing",
    isPublished: true,
    modules: [
      {
        id: "dm-m1",
        title: "أساسيات النمو",
        order: 1,
        lessons: [
          lesson("dm-l1", "صوت العلامة", "كتابة عربية دافئة وواضحة.", 13, 1),
          lesson("dm-l2", "قنوات الاكتساب", "اختيار القناة المناسبة للكورس.", 18, 2),
        ],
      },
    ],
  },
  {
    id: "python-foundations",
    slug: "python-foundations",
    title: "لغة البايثون",
    subtitle: "ابدأ البرمجة بثقة ولغة واضحة",
    description: "مدخل عملي لبايثون: المتغيرات، المنطق، وبناء سكربتات صغيرة تخدم عملك.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-baraa",
    introVimeoId: DEMO_VIMEO,
    price: iqd(69),
    salePrice: iqd(49),
    durationHours: 18,
    studentCount: 6400,
    rating: 4.8,
    level: "مبتدئ",
    category: "programming",
    isPublished: true,
    modules: [
      {
        id: "py-m1",
        title: "البداية",
        order: 1,
        lessons: [
          lesson("py-l1", "لماذا بايثون؟", "استخدامات اللغة في الويب والبيانات.", 12, 1),
          lesson("py-l2", "أول برنامج", "كتابة وتشغيل سكربت بسيط.", 16, 2),
        ],
      },
    ],
  },
  {
    id: "business-english",
    slug: "business-english",
    title: "الإنجليزية للأعمال",
    subtitle: "تحدث بثقة في الاجتماعات والبريد",
    description: "كورس لغوي عملي للمهنيين: عبارات الاجتماع، التفاوض، وكتابة إيميل احترافي.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-layla",
    introVimeoId: DEMO_VIMEO,
    price: iqd(85),
    salePrice: null,
    durationHours: 20,
    studentCount: 2780,
    rating: 4.9,
    level: "متوسط",
    category: "languages",
    isPublished: true,
    modules: [
      {
        id: "en-m1",
        title: "التواصل المهني",
        order: 1,
        lessons: [
          lesson("en-l1", "تحية وافتتاح", "جمل جاهزة للاجتماع الأول.", 14, 1),
          lesson("en-l2", "البريد الواضح", "بنية الإيميل المختصر.", 15, 2),
        ],
      },
    ],
  },
  {
    id: "digital-drawing",
    slug: "digital-drawing",
    title: "الرسم الرقمي من الصفر",
    subtitle: "من الخط إلى شخصية مكتملة",
    description: "تعلّم التكوين، الظلال، والتلوين الرقمي بأدوات شائعة وبمنهج عربي هادئ.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-karim",
    introVimeoId: DEMO_VIMEO,
    price: iqd(95),
    salePrice: iqd(75),
    durationHours: 26,
    studentCount: 1890,
    rating: 4.8,
    level: "مبتدئ",
    category: "drawing",
    isPublished: true,
    modules: [
      {
        id: "dr-m1",
        title: "أساسيات الخط",
        order: 1,
        lessons: [
          lesson("dr-l1", "الإحماء اليومي", "تمارين اليد والخط.", 11, 1),
          lesson("dr-l2", "الضوء والظل", "بناء الحجم بثقة.", 18, 2),
        ],
      },
    ],
  },
  {
    id: "brand-growth",
    slug: "brand-growth",
    title: "بناء العلامة التجارية",
    subtitle: "من الفكرة إلى عرض يُشترى",
    description: "مسار أعمال وتسويق لبناء عرض قيمة، تسعير، وقصة علامة تتذكر.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-maha",
    introVimeoId: DEMO_VIMEO,
    price: iqd(110),
    salePrice: null,
    durationHours: 16,
    studentCount: 1540,
    rating: 4.7,
    level: "متوسط",
    category: "business",
    isPublished: true,
    modules: [
      {
        id: "br-m1",
        title: "عرض القيمة",
        order: 1,
        lessons: [
          lesson("br-l1", "من تخدم؟", "تحديد الجمهور بدقة.", 13, 1),
          lesson("br-l2", "وعد العلامة", "جملة واحدة يتذكرها العميل.", 12, 2),
        ],
      },
    ],
  },
  {
    id: "cinematic-photo",
    slug: "cinematic-photo",
    title: "التصوير السينمائي",
    subtitle: "إضاءة، تكوين، وسرد بصري",
    description: "كورس كاميرا للمبدعين: من ضبط التعريض إلى مشهد يروي قصة.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-yousef",
    introVimeoId: DEMO_VIMEO,
    price: iqd(99),
    salePrice: iqd(79),
    durationHours: 21,
    studentCount: 1320,
    rating: 4.9,
    level: "متوسط",
    category: "photography",
    isPublished: true,
    modules: [
      {
        id: "ph-m1",
        title: "العين السينمائية",
        order: 1,
        lessons: [
          lesson("ph-l1", "التكوين", "قاعدة الأثلاث وما بعدها.", 15, 1),
          lesson("ph-l2", "الضوء الناعم", "مصدر واحد يكفي.", 17, 2),
        ],
      },
    ],
  },
  {
    id: "oud-foundations",
    slug: "oud-foundations",
    title: "العود من الصفر",
    subtitle: "دوزان، ريشة، وأول مقام",
    description:
      "ابدأ العود بخطوات واضحة: مسك الآلة، ضبط الأوتار، الريشة اليمنى، ثم عزف مقامات بسيطة وأغانٍ قصيرة.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a986?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-adel",
    introVimeoId: DEMO_VIMEO,
    price: iqd(95),
    salePrice: iqd(75),
    durationHours: 28,
    studentCount: 1680,
    rating: 4.9,
    level: "مبتدئ",
    category: "music",
    isPublished: true,
    modules: [
      {
        id: "oud-m1",
        title: "التعارف على العود",
        order: 1,
        lessons: [
          lesson("oud-l1", "مسك العود والريشة", "وضعية الجلوس واليد اليمنى دون توتر.", 16, 1),
          lesson("oud-l2", "الدوزان والنغمات", "ضبط الأوتار والتعرف على الدرجات.", 18, 2),
        ],
      },
      {
        id: "oud-m2",
        title: "أول لحن",
        order: 2,
        lessons: [
          lesson("oud-l3", "مقام الراست", "تمارين بسيطة على المقام.", 20, 1),
          lesson("oud-l4", "مقطوعة قصيرة", "عزف لحن كامل ببطء ثم بتدفق.", 22, 2),
        ],
      },
    ],
  },
  {
    id: "piano-beginner",
    slug: "piano-beginner",
    title: "البيانو للمبتدئين",
    subtitle: "نوتة، إيقاع، ويديّن معاً",
    description:
      "كورس بيانو عملي من وضع اليد على المفاتيح إلى قراءة النوتة وعزف أغانٍ هادئة باليدين.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-raneen",
    introVimeoId: DEMO_VIMEO,
    price: iqd(110),
    salePrice: iqd(85),
    durationHours: 32,
    studentCount: 2450,
    rating: 4.8,
    level: "مبتدئ",
    category: "music",
    isPublished: true,
    modules: [
      {
        id: "pn-m1",
        title: "المفاتيح والإيقاع",
        order: 1,
        lessons: [
          lesson("pn-l1", "لوحة المفاتيح", "الدو الأوسط ووضع الأصابع.", 14, 1),
          lesson("pn-l2", "الإيقاع البسيط", "عدّ الوحدات وعزف تمارين قصيرة.", 17, 2),
        ],
      },
    ],
  },
  {
    id: "guitar-beginner",
    slug: "guitar-beginner",
    title: "الجيتار للمبتدئين",
    subtitle: "أوتار، كوردات، وأول أغنية",
    description:
      "تعلّم الجيتار من الصفر: الدوزان، الكوردات الأساسية، الريتم، ثم عزف أغنية كاملة بمرافقة بسيطة.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-adel",
    introVimeoId: DEMO_VIMEO,
    price: iqd(89),
    salePrice: null,
    durationHours: 24,
    studentCount: 3120,
    rating: 4.8,
    level: "مبتدئ",
    category: "music",
    isPublished: true,
    modules: [
      {
        id: "gt-m1",
        title: "الأوتار والكورد",
        order: 1,
        lessons: [
          lesson("gt-l1", "مسك الجيتار", "وضعية اليد اليسرى دون ألم.", 13, 1),
          lesson("gt-l2", "كوردات C و G و D", "الانتقال السلس بين الكوردات.", 19, 2),
        ],
      },
    ],
  },
  {
    id: "violin-basics",
    slug: "violin-basics",
    title: "الكمان خطوة بخطوة",
    subtitle: "قوس، نغمة مستقيمة، وأول لحن",
    description:
      "مدخل هادئ للكمان: حمل الآلة، حركة القوس، الصوت النظيف، ثم عزف ألحان قصيرة بثقة.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=1200&q=80",
    instructorId: "ins-raneen",
    introVimeoId: DEMO_VIMEO,
    price: iqd(105),
    salePrice: iqd(82),
    durationHours: 30,
    studentCount: 980,
    rating: 4.9,
    level: "مبتدئ",
    category: "music",
    isPublished: true,
    modules: [
      {
        id: "vn-m1",
        title: "القوس والصوت",
        order: 1,
        lessons: [
          lesson("vn-l1", "حمل الكمان", "الذقن والكتف دون شد.", 15, 1),
          lesson("vn-l2", "حركة القوس", "نغمة مستقيمة على وتر واحد.", 18, 2),
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
