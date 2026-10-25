"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CourseEditor } from "@/components/admin/course-editor";
import { CreateCourseDialog } from "@/components/admin/create-course-dialog";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/categories";
import type { Course, Instructor } from "@/lib/types";
import { getEffectivePrice, isComingSoon } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function CourseManager({
  courses,
  instructors,
}: {
  courses: Course[];
  instructors: Instructor[];
}) {
  const [selectedId, setSelectedId] = useState(courses[0]?.id);
  const countRef = useRef(courses.length);

  useEffect(() => {
    if (courses.length > countRef.current) {
      setSelectedId(courses[0]?.id);
    } else if (!courses.some((course) => course.id === selectedId)) {
      setSelectedId(courses[0]?.id);
    }
    countRef.current = courses.length;
  }, [courses, selectedId]);

  const selected = useMemo(
    () => courses.find((course) => course.id === selectedId) ?? courses[0],
    [courses, selectedId],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateCourseDialog instructors={instructors} />
      </div>
      {!selected ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          لا توجد كورسات بعد. أضف كورساً جديداً للبدء.
        </p>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className={cn(
                  "rounded-2xl border p-3 transition",
                  course.id === selected.id
                    ? "border-primary/30 bg-muted"
                    : "border-border bg-card",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(course.id)}
                  className="w-full text-right"
                >
                  <span className="block font-semibold">{course.title}</span>
                  <span className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline">{CATEGORY_LABELS[course.category]}</Badge>
                    {isComingSoon(course) ? "Soon" : formatPrice(getEffectivePrice(course))}
                  </span>
                </button>
                <DeleteCourseButton
                  courseId={course.id}
                  title={course.title}
                  className="mt-3 w-full"
                />
              </div>
            ))}
          </aside>
          <CourseEditor key={selected.id} course={selected} instructors={instructors} />
        </div>
      )}
    </div>
  );
}
