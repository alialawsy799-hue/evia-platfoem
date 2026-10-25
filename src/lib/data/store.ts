import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { createSeedState, REMOVED_SEED_INSTRUCTOR_IDS } from "@/lib/data/seed";
import type { CatalogState, Course, Instructor } from "@/lib/types";

function isServerless() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function storePath() {
  if (isServerless()) {
    return path.join("/tmp", "evia-catalog-store.json");
  }
  return path.join(process.cwd(), "data", "catalog-store.json");
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeMissingFromSeed(store: CatalogState): CatalogState {
  const seed = createSeedState();
  const removedCourseIds = store.removedCourseIds ?? [];
  const removedInstructorIds = [
    ...new Set([...(store.removedInstructorIds ?? []), ...REMOVED_SEED_INSTRUCTOR_IDS]),
  ];
  const removedCourses = new Set(removedCourseIds);
  const removedInstructors = new Set(removedInstructorIds);

  const instructors = store.instructors.filter((item) => !removedInstructors.has(item.id));
  for (const instructor of seed.instructors) {
    if (
      !removedInstructors.has(instructor.id) &&
      !instructors.some((item) => item.id === instructor.id)
    ) {
      instructors.push(instructor);
    }
  }
  const isLiveCourse = (course: Course) =>
    course.id === "frontend-mastery" ||
    course.title === "تطوير الويب" ||
    course.title === "تطوير واجهات الويب";
  const courses = store.courses.map((course) => {
    if (isLiveCourse(course)) {
      return { ...course, comingSoon: course.comingSoon ?? false };
    }
    if (typeof course.comingSoon === "boolean") return course;
    return { ...course, comingSoon: true, price: 0, salePrice: null };
  });
  for (const course of seed.courses) {
    if (!removedCourses.has(course.id) && !courses.some((item) => item.id === course.id)) {
      courses.push(course);
    }
  }
  return {
    ...store,
    instructors,
    courses,
    payouts: (store.payouts ?? []).filter((item) => !removedInstructors.has(item.instructorId)),
    discountCodes: store.discountCodes ?? [],
    instructorAccounts: (store.instructorAccounts ?? []).filter(
      (item) => !removedInstructors.has(item.instructorId),
    ),
    studentAccounts: store.studentAccounts ?? [],
    authSessions: store.authSessions ?? [],
    monthlyReceipts: (store.monthlyReceipts ?? []).filter(
      (item) => !removedInstructors.has(item.instructorId),
    ),
    removedCourseIds,
    removedInstructorIds,
  };
}

async function persist(state: CatalogState) {
  const snapshot = clone(state);
  try {
    const dest = storePath();
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, JSON.stringify(snapshot, null, 2), "utf8");
  } catch {
    // Serverless filesystems are read-only except /tmp; still return the snapshot.
  }
  return snapshot;
}

async function readStoreFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return clone(mergeMissingFromSeed(JSON.parse(raw) as CatalogState));
}

function seededState() {
  return clone(mergeMissingFromSeed(createSeedState()));
}

export async function readStore(): Promise<CatalogState> {
  noStore();
  const candidates = [
    storePath(),
    path.join(process.cwd(), "data", "catalog-store.json"),
  ];
  for (const candidate of [...new Set(candidates)]) {
    try {
      return await readStoreFile(candidate);
    } catch {
      /* try next location */
    }
  }
  const fallback = seededState();
  void persist(fallback);
  return fallback;
}

export async function writeStore(next: CatalogState) {
  await persist(next);
}

export async function getPublishedCourses(): Promise<Course[]> {
  try {
    const store = await readStore();
    return store.courses.filter((course) => course.isPublished);
  } catch {
    return seededState().courses.filter((course) => course.isPublished);
  }
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const store = await readStore();
  return store.courses.find((course) => course.id === id || course.slug === id);
}

export async function getInstructor(id: string): Promise<Instructor | undefined> {
  const store = await readStore();
  return store.instructors.find((item) => item.id === id);
}

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const store = await readStore();
    return store.instructors;
  } catch {
    return seededState().instructors;
  }
}

export async function isEnrolled(userId: string, courseId: string) {
  const store = await readStore();
  return store.enrollments.some(
    (item) => item.userId === userId && item.courseId === courseId,
  );
}
