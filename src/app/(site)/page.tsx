import { CourseGrid } from "@/components/landing/course-grid";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { getInstructors, getPublishedCourses } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, instructors] = await Promise.all([
    getPublishedCourses(),
    getInstructors(),
  ]);

  return (
    <div>
      <Hero />
      <CourseGrid courses={courses} instructors={instructors} />
      <FaqAndPricing />
      <SiteFooter />
    </div>
  );
}

function FaqAndPricing() {
  return (
    <div className="mx-auto grid w-[min(1120px,calc(100%-1.5rem))] gap-8 pb-20 md:grid-cols-2">
      <section id="faq" className="rounded-2xl glass p-6">
        <h2 className="mb-4 text-2xl font-bold">الأسئلة</h2>
        <dl className="space-y-4 text-sm text-slate-300">
          <div>
            <dt className="font-semibold text-white">كيف أفعّل الكورس؟</dt>
            <dd>بعد تسجيل الدخول اضغط اشترك الآن ثم أرسل رسالة واتساب لفريق التفعيل.</dd>
          </div>
          <div>
            <dt className="font-semibold text-white">هل الفيديو محمي؟</dt>
            <dd>نعم. التضمين مقيّد بالنطاق، مع علامة مائية ديناميكية وإخفاء عند فقدان التركيز.</dd>
          </div>
        </dl>
      </section>
      <section id="pricing" className="rounded-2xl glass p-6">
        <h2 className="mb-4 text-2xl font-bold">الأسعار</h2>
        <p className="text-sm text-slate-300">
          كل كورس بسعر مستقل، مع دعم الخصم المباشر من لوحة الإدارة. يظهر السعر الأصلي مشطوباً بجانب سعر العرض.
        </p>
      </section>
    </div>
  );
}
