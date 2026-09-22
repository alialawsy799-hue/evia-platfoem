"use client";

import Image from "next/image";
import { useState } from "react";
import { CircleCheck, Clock, Play, Users } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProtectedVimeoPlayer } from "@/components/player/protected-vimeo-player";
import { Curriculum } from "@/components/course/curriculum";
import { EnrollModal } from "@/components/course/enroll-modal";
import { PriceDisplay } from "@/components/course/price-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-provider";
import { isEnrolledAs } from "@/lib/auth/identity";
import { CATEGORY_LABELS } from "@/lib/categories";
import type { Course, Instructor, Profile } from "@/lib/types";
import { getCourseDurationMinutes, getLessonCount, isComingSoon } from "@/lib/types";
import { formatDuration, formatNumber } from "@/lib/utils";
import Link from "next/link";

function getCourseOutcomes(course: Course) {
  const fromLessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.title),
  );
  const items = [course.subtitle, ...fromLessons].filter(
    (item, index, list) => item && list.indexOf(item) === index,
  );
  if (items.length >= 3) return items.slice(0, 8);
  return [
    ...items,
    `فهم أساسيات ${course.title} بشكل عملي وواضح`,
    "تطبيق ما تتعلمه على أمثلة حقيقية خطوة بخطوة",
    "تطوير مهارات يمكنك استخدامها مباشرة بعد إنهاء الكورس",
  ].slice(0, 8);
}

function getCourseAudience(course: Course) {
  const category = CATEGORY_LABELS[course.category];
  return `هذا الكورس مناسب للمبتدئين وللمستوى المتوسط، وللراغبين في تطوير مهاراتهم في مجال ${category}. سواء كنت تبدأ من الصفر أو لديك أساس وتريد التعمق أكثر، ستجد مساراً واضحاً يساعدك على التقدم بثقة وبناء خبرة عملية يمكنك الاعتماد عليها.`;
}

export function CourseDetailsView({
  course,
  instructor,
  enrolledUserIds,
  profiles,
}: {
  course: Course;
  instructor?: Instructor;
  enrolledUserIds: string[];
  profiles: Profile[];
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const canLearn = !!user && isEnrolledAs(user, enrolledUserIds, profiles);
  const lectureCount = getLessonCount(course);
  const durationLabel = formatDuration(getCourseDurationMinutes(course));
  const soon = isComingSoon(course);

  return (
    <div>
      <main className="mx-auto w-[min(1000px,calc(100%-1.5rem))] py-10">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{CATEGORY_LABELS[course.category]}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-black md:text-4xl">{course.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-400">{course.description}</p>
          </div>
          <div className="rounded-2xl glass p-5">
            <PriceDisplay course={course} size="lg" />
            <p className="mt-1 text-xs text-slate-500">
              {durationLabel} · {formatNumber(lectureCount)} درس · {formatNumber(course.studentCount)} طالب
            </p>
            {canLearn ? (
              <Button asChild className="mt-4 w-full">
                <Link href={`/learn/${course.id}`}>متابعة التعلّم</Link>
              </Button>
            ) : soon ? (
              <Button className="mt-4 w-full" disabled>
                Soon
              </Button>
            ) : (
              <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
                اشترك الآن
              </Button>
            )}
          </div>
        </div>

        {instructor ? (
          <section className="mb-6 flex items-center gap-4 rounded-2xl glass p-5">
            <Image
              src={instructor.avatarUrl}
              alt={instructor.name}
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-violet-300">{instructor.title}</p>
              <h2 className="text-xl font-bold">{instructor.name}</h2>
              <p className="text-sm text-slate-400">{instructor.bio}</p>
            </div>
          </section>
        ) : null}

        <div className="mx-auto mb-8 w-full max-w-[540px]">
          <ProtectedVimeoPlayer
            videoId={course.introVimeoId}
            hash={course.introVimeoHash}
            provider={course.introVideoProvider}
            mode="trailer"
            className="border-violet-400/25 shadow-[0_0_28px_rgba(139,92,246,0.12)]"
          />
          <p className="mt-3 text-center text-sm font-medium text-violet-200/90">
            الفيديو التعريفي عن دورة ({course.title})
          </p>
        </div>

        <section className="mb-4 rounded-2xl glass p-6">
          <h2 className="text-xl font-bold">ماذا ستتعلم في هذا الكورس؟</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">{course.description}</p>
          <ul className="mt-4 space-y-2.5">
            {getCourseOutcomes(course).map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-violet-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-2xl glass p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Users className="size-5 text-violet-300" />
            لمن هذا الكورس مناسب؟
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{getCourseAudience(course)}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <Play className="size-4 text-violet-300" />
              <div>
                <p className="text-xs text-slate-500">عدد المحاضرات</p>
                <p className="font-bold">{formatNumber(lectureCount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <Clock className="size-4 text-violet-300" />
              <div>
                <p className="text-xs text-slate-500">مدة الكورس</p>
                <p className="font-bold">{durationLabel}</p>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mb-4 text-2xl font-bold">المنهج</h2>
        <Curriculum
          course={course}
          locked={!canLearn}
          onLockedClick={soon ? undefined : () => setOpen(true)}
        />
      </main>
      <SiteFooter />
      <EnrollModal open={open} onOpenChange={setOpen} course={course} />
    </div>
  );
}
