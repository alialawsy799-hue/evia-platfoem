import { unstable_noStore as noStore } from "next/cache";
import { PayoutPanel } from "@/components/admin/payout-panel";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FinancePage() {
  noStore();
  const store = await readStore();
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">
        راجع الأرصدة المعلّقة، نفّذ التسوية لتصفير الرصيد، وتابع سجل الدفعات.
      </p>
      <PayoutPanel instructors={store.instructors} payouts={store.payouts} />
    </div>
  );
}
