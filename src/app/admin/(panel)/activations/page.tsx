import { EnrollmentEngine } from "@/components/admin/enrollment-engine";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function ActivationsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        ابحث عن الزبون بالبريد، اختر الكورس، ثم فعّل الوصول فوراً دون المرور بواتساب.
      </p>
      <EnrollmentEngine
        courses={store.courses}
        enrollments={store.enrollments}
        profiles={store.profiles}
      />
    </div>
  );
}
