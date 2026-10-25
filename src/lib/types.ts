export type UserRole = "student" | "instructor" | "admin";

export type CourseCategory =
  | "programming"
  | "marketing"
  | "design"
  | "languages"
  | "drawing"
  | "cybersecurity"
  | "data"
  | "business"
  | "photography"
  | "music";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  joinedAt?: string;
};

export type Instructor = {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  title?: string;
  yearsExperience: number;
  specialties: string[];
  balance: number;
  pendingBalance: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export type VideoProvider = "vimeo" | "youtube" | "file";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  vimeoId: string;
  vimeoHash?: string;
  videoProvider?: VideoProvider;
  order: number;
};

export type Module = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  instructorId: string;
  introVimeoId: string;
  introVimeoHash?: string;
  introVideoProvider?: VideoProvider;
  price: number;
  salePrice?: number | null;
  comingSoon?: boolean;
  durationHours: number;
  studentCount: number;
  rating: number;
  level: "مبتدئ" | "متوسط" | "متقدم";
  category: CourseCategory;
  isPublished: boolean;
  modules: Module[];
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  grantedBy: string;
  createdAt: string;
  discountCode?: string;
  paidAmount?: number;
};

export type LessonProgress = {
  userId: string;
  lessonId: string;
  completedAt: string;
};

export type QuizAttempt = {
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
};

export type Payout = {
  id: string;
  instructorId: string;
  amount: number;
  settledAt: string;
  note: string;
};

export type InstructorAccount = {
  id: string;
  instructorId: string;
  email: string;
  password?: string;
  createdAt: string;
};

export type StudentAccount = {
  email: string;
  password: string;
  createdAt: string;
};

export type AuthSession = {
  email: string;
  token: string;
  updatedAt: string;
};

export type MonthlyReceipt = {
  id: string;
  instructorId: string;
  month: string;
  amount: number;
  receivedAt: string;
};

export type DiscountType = "percent" | "fixed";

export type DiscountChannel = "standard" | "ugc";

export type DiscountCode = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  courseIds: string[];
  maxUses: number | null;
  usedCount: number;
  usedByUserIds?: string[];
  expiresAt: string | null;
  isActive: boolean;
  note?: string;
  createdAt: string;
  channel?: DiscountChannel;
  influencerName?: string;
};

export type CatalogState = {
  instructors: Instructor[];
  courses: Course[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  quizAttempts: QuizAttempt[];
  payouts: Payout[];
  profiles: Profile[];
  discountCodes: DiscountCode[];
  instructorAccounts?: InstructorAccount[];
  studentAccounts?: StudentAccount[];
  authSessions?: AuthSession[];
  monthlyReceipts?: MonthlyReceipt[];
  removedCourseIds?: string[];
  removedInstructorIds?: string[];
};

export function isComingSoon(course: Pick<Course, "comingSoon">) {
  return Boolean(course.comingSoon);
}

export function getEffectivePrice(course: Pick<Course, "price" | "salePrice">) {
  if (typeof course.salePrice === "number" && course.salePrice < course.price) {
    return course.salePrice;
  }
  return course.price;
}

export function hasDiscount(course: Pick<Course, "price" | "salePrice">) {
  return typeof course.salePrice === "number" && course.salePrice < course.price;
}

export function getCourseDurationMinutes(course: Course) {
  const fromLessons = course.modules.reduce(
    (sum, module) =>
      sum + module.lessons.reduce((inner, lesson) => inner + (lesson.durationMinutes || 0), 0),
    0,
  );
  if (fromLessons > 0) return fromLessons;
  return Math.round((course.durationHours || 0) * 60);
}

export function getLessonCount(course: Course) {
  return course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
}
