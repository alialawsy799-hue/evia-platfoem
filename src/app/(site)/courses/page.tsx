import { CourseGrid } from "@/components/landing/course-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { isCourseCategory } from "@/lib/categories";
import { getInstructors, getPublishedCourses } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [courses, instructors] = await Promise.all([
    getPublishedCourses(),
    getInstructors(),
  ]);

  return (
    <div>
      <div className="pt-10">
        <CourseGrid
          courses={courses}
          instructors={instructors}
          initialCategory={isCourseCategory(category) ? category : "all"}
          heading="كل الكورسات"
        />
      </div>
      <SiteFooter />
    </div>
  );
}
