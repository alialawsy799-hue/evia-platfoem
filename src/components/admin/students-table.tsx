import type { Course, Enrollment, Profile } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function StudentsTable({
  enrollments,
  courses,
  profiles,
}: {
  enrollments: Enrollment[];
  courses: Course[];
  profiles: Profile[];
}) {
  const rows = [...enrollments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121824]">
      <table className="w-full min-w-[720px] text-right text-sm">
        <thead className="bg-white/5 text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">الزبون</th>
            <th className="px-4 py-3 font-medium">البريد</th>
            <th className="px-4 py-3 font-medium">الكورس</th>
            <th className="px-4 py-3 font-medium">تاريخ التفعيل</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const profile = profiles.find((entry) => entry.id === item.userId);
            const course = courses.find((entry) => entry.id === item.courseId);
            return (
              <tr key={item.id} className="border-t border-white/5">
                <td className="px-4 py-3">{profile?.fullName ?? item.userId}</td>
                <td className="px-4 py-3 text-slate-400">{profile?.email ?? "—"}</td>
                <td className="px-4 py-3">{course?.title ?? item.courseId}</td>
                <td className="px-4 py-3 text-slate-400">
                  {formatDateTime(item.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-500">لا توجد تفعيلات بعد.</p>
      ) : null}
    </div>
  );
}
