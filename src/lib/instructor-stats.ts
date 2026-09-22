import type { Course, Enrollment, MonthlyReceipt } from "@/lib/types";

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(month: string) {
  const [year, monthPart] = month.split("-");
  return `${monthPart}/${year}`;
}

function enrollmentMonthKey(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return currentMonthKey(date);
}

export function countInstructorStudents(
  instructorId: string,
  courses: Course[],
  enrollments: Enrollment[],
  month?: string,
) {
  const courseIds = new Set(
    courses.filter((course) => course.instructorId === instructorId).map((course) => course.id),
  );
  const students = new Set<string>();
  for (const enrollment of enrollments) {
    if (!courseIds.has(enrollment.courseId)) continue;
    if (month && enrollmentMonthKey(enrollment.createdAt) !== month) continue;
    students.add(enrollment.userId);
  }
  return students.size;
}

export function receiptsForInstructor(
  receipts: MonthlyReceipt[] | undefined,
  instructorId: string,
) {
  return [...(receipts ?? [])]
    .filter((item) => item.instructorId === instructorId)
    .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
}
