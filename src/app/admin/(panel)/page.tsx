import Link from "next/link";
import type { ComponentType } from "react";
import { BookOpen, GraduationCap, KeyRound, TicketPercent, UserPlus, Users, Wallet } from "lucide-react";
import { readStore } from "@/lib/data/store";
import { getEffectivePrice, getLessonCount, isComingSoon } from "@/lib/types";
import { formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const store = await readStore();
  const pending = store.instructors.reduce((sum, item) => sum + item.pendingBalance, 0);
  const students = store.profiles.filter((item) => item.role === "student").length;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        مرحباً بك في لوحة إيفيا. اختر تبويباً من القائمة لإدارة التفعيل، الكورسات، المدرسين، أو المالية.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="الكورسات" value={formatNumber(store.courses.length)} />
        <Metric label="تفعيلات الزبائن" value={formatNumber(store.enrollments.length)} />
        <Metric label="الطلاب" value={formatNumber(students)} />
        <Metric label="أرصدة معلّقة" value={formatPrice(pending)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Jump href="/admin/activations" icon={UserPlus} title="تفعيل الزبائن" text="ابحث بالبريد وفعّل كورساً فوراً." />
        <Jump href="/admin/students" icon={Users} title="الزبائن" text="عرض كل الاشتراكات المفعّلة." />
        <Jump href="/admin/courses" icon={BookOpen} title="الكورسات" text="تعديل السعر، الخصم، والفيديو التعريفي." />
        <Jump href="/admin/instructors" icon={GraduationCap} title="المدرسين" text="ملفات المدرّبين وعدد كورساتهم." />
        <Jump href="/admin/instructor-accounts" icon={KeyRound} title="حساب الأستاذ" text="أنشئ حساب دخول للمدرّس وتابع طلابه وأرباحه الشهرية." />
        <Jump href="/admin/coupons" icon={TicketPercent} title="أكواد الخصم" text="أنشئ كوداً بنسبة أو مبلغاً ثابتاً وتحكم بتفعيله." />
        <Jump href="/admin/finance" icon={Wallet} title="المالية" text="تسوية الأرصدة وسجل الدفعات." />
      </div>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">آخر الكورسات</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">الكورس</th>
                <th className="pb-3 font-medium">السعر</th>
                <th className="pb-3 font-medium">الدروس</th>
                <th className="pb-3 font-medium">الطلاب الظاهرون</th>
              </tr>
            </thead>
            <tbody>
              {store.courses.slice(0, 6).map((course) => (
                <tr key={course.id} className="border-t border-border">
                  <td className="py-3">{course.title}</td>
                  <td className="py-3 tabular-nums" dir="ltr">
                    {isComingSoon(course) ? "Soon" : formatPrice(getEffectivePrice(course))}
                  </td>
                  <td className="py-3 tabular-nums">{formatNumber(getLessonCount(course))}</td>
                  <td className="py-3 tabular-nums">{formatNumber(course.studentCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/admin/courses" className="mt-4 inline-block text-sm text-primary">
          إدارة كل الكورسات
        </Link>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums" dir="ltr">{value}</p>
    </div>
  );
}

function Jump({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"
    >
      <Icon className="mb-3 size-5 text-primary" />
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Link>
  );
}
