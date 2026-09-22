import { collectUserIds, isEnrolledAs } from "@/lib/auth/identity";
import type { CatalogState, Course, InstructorAccount, Profile } from "@/lib/types";

export function isUserEnrolled(user: Profile, courseId: string, store: CatalogState) {
  const enrolledUserIds = store.enrollments
    .filter((item) => item.courseId === courseId)
    .map((item) => item.userId);
  return isEnrolledAs(user, enrolledUserIds, store.profiles);
}

export function userIdsFor(user: Profile, store: CatalogState) {
  return collectUserIds(user, store.profiles);
}

export function publicInstructorAccounts(accounts: InstructorAccount[]) {
  return accounts.map(({ password: _password, ...account }) => account);
}

export function stripQuizAnswers(course: Course): Course {
  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      quiz: module.quiz
        ? {
            ...module.quiz,
            questions: module.quiz.questions.map((question) => ({
              ...question,
              correctIndex: -1,
            })),
          }
        : undefined,
    })),
  };
}

export function sanitizeCourse(course: Course): Course {
  return {
    ...stripQuizAnswers(course),
    introVimeoId: "",
    introVimeoHash: undefined,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        vimeoId: "",
        vimeoHash: undefined,
      })),
      quiz: module.quiz
        ? {
            ...module.quiz,
            questions: module.quiz.questions.map((question) => ({
              ...question,
              correctIndex: -1,
            })),
          }
        : undefined,
    })),
  };
}

export function findCourseByLesson(store: CatalogState, lessonId: string) {
  return store.courses.find((course) =>
    course.modules.some((module) => module.lessons.some((lesson) => lesson.id === lessonId)),
  );
}

export function findCourseByQuiz(store: CatalogState, quizId: string) {
  return store.courses.find((course) =>
    course.modules.some((module) => module.quiz?.id === quizId),
  );
}
