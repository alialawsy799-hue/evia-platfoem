import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await readStore();
  return (
    <StudentDashboard
      courses={store.courses}
      enrollments={store.enrollments}
      lessonProgress={store.lessonProgress}
      profiles={store.profiles}
    />
  );
}
