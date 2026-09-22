"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteInstructor } from "@/lib/data/actions";

export function DeleteInstructorButton({
  instructorId,
  name,
  className,
}: {
  instructorId: string;
  name: string;
  className?: string;
}) {
  return (
    <ConfirmDeleteButton
      className={className}
      label="حذف المدرس"
      confirmMessage={`حذف المدرس «${name}»؟ سيتم حذف كورساته أيضاً.`}
      onConfirm={() => deleteInstructor(instructorId)}
    />
  );
}
