import { UgcCouponManager } from "@/components/admin/ugc-coupon-manager";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UgcCouponsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <UgcCouponManager
        courses={store.courses}
        coupons={store.discountCodes ?? []}
        enrollments={store.enrollments ?? []}
        profiles={store.profiles ?? []}
      />
    </div>
  );
}
