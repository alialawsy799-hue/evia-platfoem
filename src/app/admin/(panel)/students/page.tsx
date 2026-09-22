import { StudentsTable } from "@/components/admin/students-table";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400">
        قائمة الزبائن المفعّلين والكورسات المرتبطة بكل حساب.
      </p>
      <StudentsTable
        enrollments={store.enrollments}
        courses={store.courses}
        profiles={store.profiles}
      />
    </div>
  );
}
