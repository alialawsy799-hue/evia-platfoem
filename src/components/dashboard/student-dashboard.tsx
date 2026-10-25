"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { useAuth } from "@/components/auth/auth-provider";
import { collectUserIds } from "@/lib/auth/identity";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Course, Enrollment, LessonProgress, Profile } from "@/lib/types";
import { getLessonCount } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export function StudentDashboard({
  courses,
  enrollments,
  lessonProgress,
  profiles,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  profiles: Profile[];
}) {
  const { user } = useAuth();
  const enrolledCourses = useMemo(() => {
    if (!user) return [];
    const ids = collectUserIds(user, profiles);
    const courseIds = enrollments.filter((item) => ids.has(item.userId)).map((item) => item.courseId);
    return courses.filter((course) => courseIds.includes(course.id));
  }, [user, profiles, enrollments, courses]);

  const progressByCourse = useMemo(() => {
    if (!user) return {};
    const ids = collectUserIds(user, profiles);
    return Object.fromEntries(
      enrolledCourses.map((course) => {
        const total = getLessonCount(course);
        const done = lessonProgress.filter(
          (item) =>
            ids.has(item.userId) &&
            course.modules.some((module) =>
              module.lessons.some((lesson) => lesson.id === item.lessonId),
            ),
        ).length;
        return [course.id, total ? Math.round((done / total) * 100) : 0];
      }),
    ) as Record<string, number>;
  }, [user, profiles, enrolledCourses, lessonProgress]);

  const first = Object.values(progressByCourse)[0] ?? 0;

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p>الرجاء تسجيل الدخول.</p>
      </div>
    );
  }

  return (
    <RoleGate allow={["student"]}>
    <div>
      <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-black md:text-4xl">مرحباً بك، {user.fullName.split(" ")[0]}</h1>
          <Button asChild>
            <Link href="/#courses">أكمل رحلتك</Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div id="profile" className="flex flex-col items-center rounded-2xl glass p-6">
            <div className="relative grid size-36 place-items-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#8B5CF6 ${first * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                  filter: "drop-shadow(0 0 18px rgba(130,80,161,0.35))",
                }}
              />
              <div className="absolute inset-3 rounded-full bg-white" />
              <span className="relative text-2xl font-black">{formatNumber(first)}%</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">إنجازك الحالي</p>
            <div className="mt-4 w-full space-y-3 text-right">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs font-semibold text-primary">معلوماتي</p>
                <p className="mt-1 text-sm text-foreground">{user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  تاريخ الدخول: {user.joinedAt ? formatDate(user.joinedAt) : "—"}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                <p className="text-sm text-muted-foreground">عدد كورساتي</p>
                <p className="text-lg font-black">{formatNumber(enrolledCourses.length)}</p>
              </div>
            </div>
          </div>
          <article className="relative overflow-hidden rounded-2xl border border-primary/20 md:col-span-2">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-662883328dbc?auto=format&fit=crop&w=1400&q=80"
              alt="جلسة مباشرة"
              fill
              className="object-cover"
            />
            <div className="relative bg-gradient-to-l from-white/90 to-primary/30 p-8">
              <p className="text-sm text-primary">جلسة مباشرة</p>
              <h2 className="mt-2 text-2xl font-bold">مختبر الواجهات الأسبوعية</h2>
              <Button className="mt-5">انضم الآن</Button>
            </div>
          </article>
        </div>

        <h2 className="mt-10 mb-4 text-xl font-bold">تابع التعلم</h2>
        {enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">لا توجد كورسات مفعّلة على حسابك بعد.</p>
            <Button asChild className="mt-4">
              <Link href="/courses">تصفح الكورسات</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/${course.id}`}
                className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40"
              >
                <div className="relative aspect-video">
                  <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="mb-3 text-xs text-muted-foreground">{formatNumber(getLessonCount(course))} درس</p>
                  <Progress value={progressByCourse[course.id] ?? 0} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
    </RoleGate>
  );
}
