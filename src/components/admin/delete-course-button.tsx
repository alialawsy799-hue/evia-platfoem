"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteCourse } from "@/lib/data/actions";

export function DeleteCourseButton({
  courseId,
  title,
  className,
}: {
  courseId: string;
  title: string;
  className?: string;
}) {
  return (
    <ConfirmDeleteButton
      className={className}
      label="حذف الكورس"
      confirmMessage={`حذف كورس «${title}»؟ سيُزال من المنصة فوراً.`}
      onConfirm={() => deleteCourse(courseId)}
    />
  );
}
