import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { getInstructors, getPublishedCourses } from "@/lib/data/store";
import { getLessonCount } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InstructorsPage() {
  const [instructors, courses] = await Promise.all([
    getInstructors(),
    getPublishedCourses(),
  ]);

  return (
    <div>
      <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-12">
        <p className="text-sm text-violet-300">فريق التدريس</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">المدرسين</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          تعرّف على خبرات المدرّبين وعدد كورساتهم قبل أن تبدأ رحلتك.
        </p>
        {instructors.length === 0 ? (
          <p className="mt-8 rounded-2xl glass p-8 text-center text-slate-400">
            لا يوجد مدرسون حالياً. ستتم إضافتهم قريباً من لوحة التحكم.
          </p>
        ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => {
            const taught = courses.filter((course) => course.instructorId === instructor.id);
            return (
              <article
                key={instructor.id}
                className="rounded-2xl border border-white/10 bg-[#121824] p-5 transition hover:border-violet-400/40"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={instructor.avatarUrl}
                    alt={instructor.name}
                    width={72}
                    height={72}
                    className="size-[72px] rounded-full object-cover ring-2 ring-violet-400/30"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{instructor.name}</h2>
                    <p className="text-sm text-violet-300">{instructor.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{instructor.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {instructor.specialties.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xl font-black">{formatNumber(instructor.yearsExperience)}+</p>
                    <p className="text-xs text-slate-500">سنوات خبرة</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xl font-black">{formatNumber(taught.length)}</p>
                    <p className="text-xs text-slate-500">عدد الكورسات</p>
                  </div>
                </div>
                {taught[0] ? (
                  <Link
                    href={`/courses/${taught[0].id}`}
                    className="mt-4 block text-sm text-violet-300"
                  >
                    أحدث كورس: {taught[0].title} · {formatNumber(getLessonCount(taught[0]))} درس
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
