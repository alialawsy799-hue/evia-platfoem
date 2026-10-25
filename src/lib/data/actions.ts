"use server";

import { revalidatePath } from "next/cache";
import { readStore, writeStore } from "@/lib/data/store";
import { studentIdFromEmail } from "@/lib/auth/identity";
import { emailsMatch, findByEmail, normalizeEmail } from "@/lib/auth/email";
import {
  assertEmailAvailable,
  clearAuthSession,
} from "@/lib/auth/exclusive-session";
import { requireAdmin, requireAdminOrInstructor, requireUser } from "@/lib/auth/guards";
import { findCourseByLesson, findCourseByQuiz, isUserEnrolled, userIdsFor } from "@/lib/auth/access";
import { hashPassword } from "@/lib/auth/passwords";
import { evaluateDiscountCode, normalizeDiscountCode } from "@/lib/discount";
import { currentMonthKey } from "@/lib/instructor-stats";
import type { CatalogState, Course, CourseCategory, DiscountChannel, DiscountType, Module } from "@/lib/types";
import { saveUploadedImage } from "@/lib/uploads";
import { slugify } from "@/lib/utils";
import { parseVideoLink } from "@/lib/video";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/instructors");
  revalidatePath("/admin", "layout");
  revalidatePath("/instructor");
  revalidatePath("/dashboard");
  revalidatePath("/learn", "layout");
}

export async function updateCoursePricing(formData: FormData) {
  await requireAdmin();
  const courseId = String(formData.get("courseId") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const saleRaw = String(formData.get("salePrice") ?? "").trim();
  const introRaw = String(formData.get("introVideoUrl") ?? formData.get("introVimeoId") ?? "").trim();
  const parsedIntro = introRaw ? parseVideoLink(introRaw) : null;
  if (introRaw && !parsedIntro) throw new Error("رابط الفيديو التعريفي غير صالح. الصق رابط Vimeo أو YouTube.");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const studentCount = Number(formData.get("studentCount") ?? 0);
  const durationHours = Number(formData.get("durationHours") ?? 0);
  const instructorId = String(formData.get("instructorId") ?? "");
  const thumbnailFile = formData.get("thumbnail");
  const uploadedThumbnail =
    thumbnailFile instanceof File ? await saveUploadedImage(thumbnailFile, "courses") : null;
  const category = String(formData.get("category") ?? "").trim();

  const store = await readStore();
  const index = store.courses.findIndex((course) => course.id === courseId);
  if (index === -1) throw new Error("الكورس غير موجود");

  const salePrice = saleRaw === "" ? null : Number(saleRaw);
  const comingSoon = String(formData.get("comingSoon") ?? "") === "on";

  store.courses[index] = {
    ...store.courses[index],
    title: title || store.courses[index].title,
    description: description || store.courses[index].description,
    price: comingSoon ? 0 : Number.isFinite(price) ? price : store.courses[index].price,
    salePrice: comingSoon
      ? null
      : salePrice !== null && Number.isFinite(salePrice)
        ? salePrice
        : null,
    comingSoon,
    introVimeoId: parsedIntro?.id || store.courses[index].introVimeoId,
    introVimeoHash: parsedIntro ? parsedIntro.hash : store.courses[index].introVimeoHash,
    introVideoProvider: parsedIntro?.provider || store.courses[index].introVideoProvider,
    studentCount: Number.isFinite(studentCount)
      ? studentCount
      : store.courses[index].studentCount,
    durationHours: Number.isFinite(durationHours)
      ? durationHours
      : store.courses[index].durationHours,
    instructorId,
    thumbnailUrl: uploadedThumbnail || store.courses[index].thumbnailUrl,
    category: (category || store.courses[index].category) as CourseCategory,
  };

  await writeStore(store);
  revalidatePublic();
  revalidatePath(`/courses/${courseId}`);
}

export async function createInstructor(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("اسم المدرس مطلوب");

  const store = await readStore();
  const specialties = String(formData.get("specialties") ?? "")
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const avatarFile = formData.get("avatar");
  const avatarUrl =
    avatarFile instanceof File
      ? await saveUploadedImage(avatarFile, "instructors")
      : null;

  store.instructors.unshift({
    id: `ins-${Date.now()}`,
    name,
    title: String(formData.get("title") ?? "").trim() || "مدرّب",
    avatarUrl: avatarUrl || "",
    bio: String(formData.get("bio") ?? "").trim() || "مدرّب في منصة إيفيا.",
    yearsExperience: Number(formData.get("yearsExperience")) || 1,
    specialties: specialties.length ? specialties : ["تدريس"],
    balance: 0,
    pendingBalance: 0,
  });

  await writeStore(store);
  revalidatePublic();
  revalidatePath("/admin/instructors");
  revalidatePath("/admin/finance");
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const instructorId = String(formData.get("instructorId") ?? "").trim();
  if (!title) throw new Error("عنوان الكورس مطلوب");

  const store = await readStore();
  const id = `course-${Date.now()}`;
  const introRaw = String(formData.get("introVideoUrl") ?? formData.get("introVimeoId") ?? "").trim();
  const parsedIntro = introRaw ? parseVideoLink(introRaw) : null;
  if (introRaw && !parsedIntro) throw new Error("رابط الفيديو التعريفي غير صالح. الصق رابط Vimeo أو YouTube.");
  const introVimeoId = parsedIntro?.id || "76979871";
  const comingSoon = String(formData.get("comingSoon") ?? "") === "on";
  const price = Number(formData.get("price"));
  const saleRaw = String(formData.get("salePrice") ?? "").trim();
  const salePrice = saleRaw === "" ? null : Number(saleRaw);
  const levelRaw = String(formData.get("level") ?? "مبتدئ");
  const level = (["مبتدئ", "متوسط", "متقدم"].includes(levelRaw) ? levelRaw : "مبتدئ") as Course["level"];
  const category = (String(formData.get("category") ?? "programming") || "programming") as CourseCategory;
  const thumbnailFile = formData.get("thumbnail");
  const uploadedThumbnail =
    thumbnailFile instanceof File ? await saveUploadedImage(thumbnailFile, "courses") : null;

  store.courses.unshift({
    id,
    slug: slugify(title) || id,
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || title,
    description: String(formData.get("description") ?? "").trim() || "سيتم إضافة وصف الكورس قريباً.",
    thumbnailUrl:
      uploadedThumbnail ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    instructorId,
    comingSoon,
    introVimeoId,
    introVimeoHash: parsedIntro?.hash,
    introVideoProvider: parsedIntro?.provider,
    price: comingSoon ? 0 : Number.isFinite(price) ? price : 0,
    salePrice: comingSoon
      ? null
      : salePrice !== null && Number.isFinite(salePrice)
        ? salePrice
        : null,
    durationHours: Number(formData.get("durationHours")) || 1,
    studentCount: 0,
    rating: 5,
    level,
    category,
    isPublished: true,
    modules: [
      {
        id: `${id}-m1`,
        title: "الوحدة الأولى",
        order: 1,
        lessons: [
          {
            id: `${id}-l1`,
            title: "الدرس الأول",
            description: "سيتم تحديث محتوى الدرس لاحقاً.",
            durationMinutes: 10,
            vimeoId: introVimeoId,
            vimeoHash: parsedIntro?.hash,
            videoProvider: parsedIntro?.provider,
            order: 1,
          },
        ],
      },
    ],
  });

  await writeStore(store);
  revalidatePublic();
  revalidatePath("/admin/courses");
  return { ok: true, id };
}

function removeCourseFromStore(store: CatalogState, courseId: string) {
  const course = store.courses.find((item) => item.id === courseId);
  if (!course) return;

  const lessonIds = new Set(
    course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)),
  );
  const quizIds = new Set(
    course.modules.map((module) => module.quiz?.id).filter((id): id is string => Boolean(id)),
  );

  store.courses = store.courses.filter((item) => item.id !== courseId);
  store.enrollments = store.enrollments.filter((item) => item.courseId !== courseId);
  store.lessonProgress = store.lessonProgress.filter((item) => !lessonIds.has(item.lessonId));
  store.quizAttempts = store.quizAttempts.filter((item) => !quizIds.has(item.quizId));
  store.removedCourseIds = [...new Set([...(store.removedCourseIds ?? []), courseId])];
}

export async function deleteCourse(courseId: string) {
  await requireAdmin();
  const store = await readStore();
  if (!store.courses.some((course) => course.id === courseId)) {
    throw new Error("الكورس غير موجود");
  }
  removeCourseFromStore(store, courseId);
  await writeStore(store);
  revalidatePublic();
  revalidatePath("/admin/courses");
  revalidatePath(`/courses/${courseId}`);
}

export async function deleteInstructor(instructorId: string) {
  await requireAdmin();
  const store = await readStore();
  if (!store.instructors.some((instructor) => instructor.id === instructorId)) {
    throw new Error("المدرس غير موجود");
  }

  store.courses = store.courses.map((course) =>
    course.instructorId === instructorId ? { ...course, instructorId: "" } : course,
  );

  store.instructors = store.instructors.filter((item) => item.id !== instructorId);
  store.payouts = store.payouts.filter((item) => item.instructorId !== instructorId);
  store.instructorAccounts = (store.instructorAccounts ?? []).filter(
    (item) => item.instructorId !== instructorId,
  );
  store.monthlyReceipts = (store.monthlyReceipts ?? []).filter(
    (item) => item.instructorId !== instructorId,
  );
  store.removedInstructorIds = [...new Set([...(store.removedInstructorIds ?? []), instructorId])];

  await writeStore(store);
  revalidatePublic();
  revalidatePath("/admin/instructors");
  revalidatePath("/admin/finance");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/instructor-accounts");
}

export async function upsertCourse(course: Course) {
  await requireAdmin();
  const store = await readStore();
  const index = store.courses.findIndex((item) => item.id === course.id);
  if (index === -1) store.courses.unshift(course);
  else store.courses[index] = course;
  await writeStore(store);
  revalidatePublic();
  revalidatePath(`/courses/${course.id}`);
}

export async function activateEnrollment(formData: FormData) {
  await requireAdmin();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const courseId = String(formData.get("courseId") ?? "");
  const rawCode = String(formData.get("discountCode") ?? "");
  if (!email || !courseId) throw new Error("بيانات ناقصة");

  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId);
  if (!course) throw new Error("الكورس غير موجود");

  let profile = findByEmail(store.profiles, email);
  if (!profile) {
    profile = {
      id: studentIdFromEmail(email),
      email,
      fullName: email.split("@")[0],
      role: "student",
    };
    store.profiles.push(profile);
  }

  const exists = store.enrollments.some(
    (item) => item.userId === profile.id && item.courseId === courseId,
  );

  let appliedCode: string | undefined;
  let paidAmount: number | undefined;

  if (!exists) {
    const evaluated = rawCode.trim()
      ? evaluateDiscountCode(store.discountCodes ?? [], rawCode, course)
      : null;
    if (evaluated && !evaluated.ok) throw new Error(evaluated.error);
    if (evaluated?.ok) {
      appliedCode = evaluated.coupon.code;
      paidAmount = evaluated.finalPrice;
      const coupon = store.discountCodes.find((item) => item.id === evaluated.coupon.id);
      if (coupon) {
        coupon.usedCount += 1;
        coupon.usedByUserIds = coupon.usedByUserIds ?? [];
        if (!coupon.usedByUserIds.includes(profile.id)) {
          coupon.usedByUserIds.push(profile.id);
        }
      }
    }

    store.enrollments.push({
      id: `enr-${Date.now()}`,
      userId: profile.id,
      courseId,
      grantedBy: "admin-evia",
      createdAt: new Date().toISOString(),
      discountCode: appliedCode,
      paidAmount,
    });
  }

  await writeStore(store);
  revalidatePublic();
  revalidatePath("/admin/coupons");
  revalidatePath("/admin/ugc-coupons");
  return { ok: true, userId: profile.id };
}

export async function settleInstructorBalance(formData: FormData) {
  await requireAdmin();
  const instructorId = String(formData.get("instructorId") ?? "");
  const store = await readStore();
  const instructor = store.instructors.find((item) => item.id === instructorId);
  if (!instructor) throw new Error("المدرب غير موجود");

  const amount = instructor.pendingBalance || instructor.balance;
  if (amount <= 0) return { ok: true, amount: 0 };

  store.payouts.unshift({
    id: `pay-${Date.now()}`,
    instructorId,
    amount,
    settledAt: new Date().toISOString(),
    note: "تسوية يدوية — تصفير الرصيد",
  });

  store.instructors = store.instructors.map((item) =>
    item.id === instructorId ? { ...item, pendingBalance: 0, balance: 0 } : item,
  );
  await writeStore(store);
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/finance");
  revalidatePath("/admin/instructors");
  revalidatePath("/instructor");
  revalidatePath("/instructors");
  return { ok: true, amount };
}

export async function markLessonComplete(lessonId: string) {
  const user = await requireUser();
  const store = await readStore();
  const course = findCourseByLesson(store, lessonId);
  if (!course || !isUserEnrolled(user, course.id, store)) {
    throw new Error("غير مصرح");
  }

  const ids = userIdsFor(user, store);
  const exists = store.lessonProgress.some(
    (item) => ids.has(item.userId) && item.lessonId === lessonId,
  );
  if (!exists) {
    store.lessonProgress.push({
      userId: user.id,
      lessonId,
      completedAt: new Date().toISOString(),
    });
    await writeStore(store);
  }
  revalidatePath("/learn", "layout");
  revalidatePath("/dashboard");
}

export async function saveQuizAttempt(quizId: string, answers: Record<string, number>) {
  const user = await requireUser();
  const store = await readStore();
  const course = findCourseByQuiz(store, quizId);
  const quiz = course?.modules.find((module) => module.quiz?.id === quizId)?.quiz;
  if (!course || !quiz || !isUserEnrolled(user, course.id, store)) {
    throw new Error("غير مصرح");
  }

  const correct = quiz.questions.filter(
    (question) => answers[question.id] === question.correctIndex,
  ).length;
  const score = quiz.questions.length
    ? Math.round((correct / quiz.questions.length) * 100)
    : 0;
  const passed = score >= quiz.passingScore;

  store.quizAttempts.push({
    userId: user.id,
    quizId,
    score,
    passed,
    attemptedAt: new Date().toISOString(),
  });
  await writeStore(store);
  revalidatePath("/learn", "layout");
  return { score, passed };
}

export async function getMyCourseCount() {
  const user = await requireUser();
  const store = await readStore();
  if (user.role === "instructor") {
    return store.courses.filter((course) => course.instructorId === user.id).length;
  }
  const ids = userIdsFor(user, store);
  return store.enrollments.filter((item) => ids.has(item.userId)).length;
}

export async function replaceModules(courseId: string, modules: Module[]) {
  await requireAdmin();
  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId);
  if (!course) throw new Error("الكورس غير موجود");
  course.modules = modules.map((module, moduleIndex) => ({
    ...module,
    order: moduleIndex + 1,
    lessons: module.lessons.map((lesson, lessonIndex) => {
      const looksLikeUrl = /^https?:\/\//i.test(lesson.vimeoId);
      const parsed = looksLikeUrl ? parseVideoLink(lesson.vimeoId) : null;
      if (looksLikeUrl && !parsed) {
        throw new Error(`رابط فيديو غير صالح في الدرس: ${lesson.title || "بدون عنوان"}`);
      }
      return {
        ...lesson,
        order: lessonIndex + 1,
        vimeoId: parsed?.id ?? lesson.vimeoId,
        vimeoHash: parsed?.hash ?? lesson.vimeoHash,
        videoProvider: parsed?.provider ?? lesson.videoProvider,
      };
    }),
  }));
  await writeStore(store);
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/learn/${courseId}`);
  revalidatePath("/admin/courses");
  revalidatePath("/admin", "layout");
  revalidatePath("/learn", "layout");
}

function parseCouponForm(formData: FormData) {
  const code = normalizeDiscountCode(String(formData.get("code") ?? ""));
  if (!code) throw new Error("كود الخصم مطلوب");
  if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
    throw new Error("الكود يجب أن يكون من 3 إلى 24 حرفاً إنجليزياً أو رقماً");
  }

  const typeRaw = String(formData.get("type") ?? "percent");
  const type: DiscountType = typeRaw === "fixed" ? "fixed" : "percent";
  const value = Number(formData.get("value"));
  if (!Number.isFinite(value) || value <= 0) throw new Error("أدخل قيمة خصم صحيحة");
  if (type === "percent" && value > 100) throw new Error("النسبة يجب ألا تتجاوز 100");

  const allCourses = String(formData.get("allCourses") ?? "") === "on";
  const courseIds = allCourses
    ? []
    : formData
        .getAll("courseIds")
        .map((item) => String(item))
        .filter(Boolean);
  if (!allCourses && courseIds.length === 0) {
    throw new Error("اختر كورساً واحداً على الأقل أو فعّل كل الكورسات");
  }

  const maxRaw = String(formData.get("maxUses") ?? "").trim();
  const maxUses = maxRaw === "" ? null : Number(maxRaw);
  if (maxUses !== null && (!Number.isFinite(maxUses) || maxUses < 1)) {
    throw new Error("حد الاستخدام يجب أن يكون رقماً أكبر من صفر");
  }

  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  const expiresAt = expiresRaw ? new Date(`${expiresRaw}T23:59:59`).toISOString() : null;
  if (expiresAt && Number.isNaN(new Date(expiresAt).getTime())) {
    throw new Error("تاريخ الانتهاء غير صالح");
  }

  const channelRaw = String(formData.get("channel") ?? "standard");
  const channel: DiscountChannel = channelRaw === "ugc" ? "ugc" : "standard";
  const influencerName = String(formData.get("influencerName") ?? "").trim();
  if (channel === "ugc" && !influencerName) {
    throw new Error("اسم المشهور مطلوب");
  }

  return {
    code,
    type,
    value,
    courseIds,
    maxUses,
    expiresAt,
    isActive: String(formData.get("isActive") ?? "") === "on",
    note: String(formData.get("note") ?? "").trim(),
    channel,
    influencerName: channel === "ugc" ? influencerName : undefined,
  };
}

function revalidateCoupons() {
  revalidatePath("/admin/coupons");
  revalidatePath("/admin/ugc-coupons");
  revalidatePath("/admin", "layout");
  revalidatePath("/courses");
}

export async function upsertDiscountCode(formData: FormData) {
  await requireAdmin();
  const parsed = parseCouponForm(formData);
  const id = String(formData.get("id") ?? "").trim();
  const store = await readStore();
  if (!store.discountCodes) store.discountCodes = [];

  const duplicate = store.discountCodes.find(
    (item) => item.code === parsed.code && item.id !== id,
  );
  if (duplicate) throw new Error("هذا الكود مستخدم مسبقاً");

  if (id) {
    const index = store.discountCodes.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("كود الخصم غير موجود");
    store.discountCodes[index] = {
      ...store.discountCodes[index],
      ...parsed,
    };
  } else {
    store.discountCodes.unshift({
      id: parsed.channel === "ugc" ? `ugc-${Date.now()}` : `dc-${Date.now()}`,
      usedCount: 0,
      usedByUserIds: [],
      createdAt: new Date().toISOString(),
      ...parsed,
    });
  }

  await writeStore(store);
  revalidateCoupons();
  return { ok: true };
}

export async function toggleDiscountCode(id: string) {
  await requireAdmin();
  const store = await readStore();
  const coupon = store.discountCodes?.find((item) => item.id === id);
  if (!coupon) throw new Error("كود الخصم غير موجود");
  coupon.isActive = !coupon.isActive;
  await writeStore(store);
  revalidateCoupons();
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  const store = await readStore();
  if (!store.discountCodes?.some((item) => item.id === id)) {
    throw new Error("كود الخصم غير موجود");
  }
  store.discountCodes = store.discountCodes.filter((item) => item.id !== id);
  await writeStore(store);
  revalidateCoupons();
}

export async function validateDiscountCode(code: string, courseId: string) {
  await requireUser();
  const store = await readStore();
  const course = store.courses.find((item) => item.id === courseId || item.slug === courseId);
  if (!course) return { ok: false as const, error: "الكورس غير موجود" };

  const result = evaluateDiscountCode(store.discountCodes ?? [], code, course);
  if (!result.ok) return result;

  return {
    ok: true as const,
    code: result.coupon.code,
    type: result.coupon.type,
    value: result.coupon.value,
    originalPrice: result.originalPrice,
    finalPrice: result.finalPrice,
    savings: result.savings,
  };
}

function revalidateInstructorAccounts() {
  revalidatePath("/admin/instructor-accounts");
  revalidatePath("/admin", "layout");
  revalidatePath("/instructor");
}

export async function createInstructorAccount(formData: FormData) {
  await requireAdmin();
  const instructorId = String(formData.get("instructorId") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!instructorId) throw new Error("اختر المدرّس");
  if (!email) throw new Error("البريد الإلكتروني مطلوب");
  if (password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");

  const store = await readStore();
  const instructor = store.instructors.find((item) => item.id === instructorId);
  if (!instructor) throw new Error("المدرّس غير موجود");

  const accounts = store.instructorAccounts ?? [];
  if (accounts.some((item) => item.instructorId === instructorId)) {
    throw new Error("هذا المدرّس لديه حساب مسبقاً");
  }
  assertEmailAvailable(store, email);

  accounts.unshift({
    id: `ins-acc-${Date.now()}`,
    instructorId,
    email,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  store.instructorAccounts = accounts;

  const profileIndex = store.profiles.findIndex((item) => emailsMatch(item.email, email));
  const profile = {
    id: instructorId,
    email,
    fullName: instructor.name,
    avatarUrl: instructor.avatarUrl,
    role: "instructor" as const,
    joinedAt: new Date().toISOString(),
  };
  if (profileIndex === -1) store.profiles.push(profile);
  else store.profiles[profileIndex] = { ...store.profiles[profileIndex], ...profile };

  await writeStore(store);
  revalidateInstructorAccounts();
  return { ok: true, email };
}

export async function deleteInstructorAccount(accountId: string) {
  await requireAdmin();
  const store = await readStore();
  const accounts = store.instructorAccounts ?? [];
  const account = accounts.find((item) => item.id === accountId);
  if (!account) throw new Error("الحساب غير موجود");

  store.instructorAccounts = accounts.filter((item) => item.id !== accountId);
  store.profiles = store.profiles.filter(
    (item) =>
      !(item.role === "instructor" && emailsMatch(item.email, account.email)),
  );
  clearAuthSession(store, account.email);

  await writeStore(store);
  revalidateInstructorAccounts();
}

export async function confirmInstructorMonthlyReceipt(formData: FormData) {
  const actor = await requireAdminOrInstructor();
  const instructorId = String(formData.get("instructorId") ?? "").trim();
  const amount = Number(formData.get("amount"));
  if (!instructorId) throw new Error("المدرّس غير محدد");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("أدخل مبلغ الأرباح المستلمة");
  if (actor.kind === "instructor" && actor.user.id !== instructorId) {
    throw new Error("غير مصرح");
  }

  const store = await readStore();
  if (!store.instructors.some((item) => item.id === instructorId)) {
    throw new Error("المدرّس غير موجود");
  }

  const month = currentMonthKey();
  const receipts = store.monthlyReceipts ?? [];
  const receivedAt = new Date().toISOString();

  receipts.unshift({
    id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    instructorId,
    month,
    amount,
    receivedAt,
  });
  store.monthlyReceipts = receipts;
  store.payouts.unshift({
    id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    instructorId,
    amount,
    settledAt: receivedAt,
    note: `أرباح شهر ${month} — تم الاستلام`,
  });

  await writeStore(store);
  revalidateInstructorAccounts();
  revalidatePath("/admin/finance");
  return { ok: true, amount, month };
}
