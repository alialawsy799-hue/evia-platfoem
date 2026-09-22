import { notFound, redirect } from "next/navigation";
import { LearnStudio } from "@/components/learn/learn-studio";
import { isUserEnrolled, sanitizeCourse, stripQuizAnswers, userIdsFor } from "@/lib/auth/access";
import { readAuthSession } from "@/lib/auth/session";
import { getCourseById, readStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await readAuthSession();
  if (!user) redirect("/");

  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) notFound();

  const store = await readStore();
  const enrolled = isUserEnrolled(user, course.id, store);
  if (!enrolled) {
    return (
      <LearnStudio
        course={sanitizeCourse(course)}
        enrolled={false}
        completedLessonIds={[]}
        passedQuizIds={[]}
      />
    );
  }

  const ids = userIdsFor(user, store);
  const completedLessonIds = store.lessonProgress
    .filter((item) => ids.has(item.userId))
    .map((item) => item.lessonId);
  const passedQuizIds = store.quizAttempts
    .filter((item) => ids.has(item.userId) && item.passed)
    .map((item) => item.quizId);

  return (
    <LearnStudio
      course={stripQuizAnswers(course)}
      enrolled
      completedLessonIds={completedLessonIds}
      passedQuizIds={passedQuizIds}
    />
  );
}
