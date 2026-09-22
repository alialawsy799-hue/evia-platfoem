import { notFound } from "next/navigation";
import { CourseDetailsView } from "@/components/course/course-details-view";
import { getCourseById, getInstructor, readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) notFound();
  const instructor = await getInstructor(course.instructorId);
  const store = await readStore();
  const enrolledUserIds = store.enrollments
    .filter((item) => item.courseId === course.id)
    .map((item) => item.userId);

  return (
    <CourseDetailsView
      course={course}
      instructor={instructor}
      enrolledUserIds={enrolledUserIds}
      profiles={store.profiles}
    />
  );
}
