import { unstable_noStore as noStore } from "next/cache";
import { publicInstructorAccounts } from "@/lib/auth/access";
import { InstructorAccountManager } from "@/components/admin/instructor-account-manager";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InstructorAccountsPage() {
  noStore();
  const store = await readStore();
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">
        أنشئ حساب دخول للمدرّس، ثم تابع عدد طلابه هذا الشهر والكلي، وسجّل المبلغ الذي استلمه من نسبته.
      </p>
      <InstructorAccountManager
        instructors={store.instructors}
        accounts={publicInstructorAccounts(store.instructorAccounts ?? [])}
        courses={store.courses}
        enrollments={store.enrollments}
        receipts={store.monthlyReceipts ?? []}
      />
    </div>
  );
}
