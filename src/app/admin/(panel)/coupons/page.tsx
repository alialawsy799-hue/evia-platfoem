import { CouponManager } from "@/components/admin/coupon-manager";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CouponsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <CouponManager courses={store.courses} coupons={store.discountCodes ?? []} />
    </div>
  );
}
