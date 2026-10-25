import { CourseManager } from "@/components/admin/course-manager";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        اختر كورساً من القائمة لتعديل بياناته، ثم الصق روابط فيديوهات الدروس مباشرة.
      </p>
      <CourseManager courses={store.courses} instructors={store.instructors} />
    </div>
  );
}
