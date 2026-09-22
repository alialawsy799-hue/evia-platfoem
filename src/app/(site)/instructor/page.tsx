import { redirect } from "next/navigation";
import { InstructorDashboard } from "@/components/instructor/instructor-dashboard";
import { emailsMatch } from "@/lib/auth/email";
import { publicInstructorAccounts } from "@/lib/auth/access";
import { readAuthSession } from "@/lib/auth/session";
import { readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function InstructorPage() {
  const user = await readAuthSession();
  if (!user || user.role !== "instructor") redirect("/");

  const store = await readStore();
  const account = (store.instructorAccounts ?? []).find((item) =>
    emailsMatch(item.email, user.email),
  );
  const instructorId = account?.instructorId || user.id;
  const myCourses = store.courses.filter((course) => course.instructorId === instructorId);
  const courseIds = new Set(myCourses.map((course) => course.id));
  return (
    <InstructorDashboard
      instructors={store.instructors.filter((item) => item.id === instructorId)}
      accounts={publicInstructorAccounts(account ? [account] : [])}
      courses={myCourses}
      enrollments={store.enrollments.filter((item) => courseIds.has(item.courseId))}
      receipts={(store.monthlyReceipts ?? []).filter((item) => item.instructorId === instructorId)}
    />
  );
}
