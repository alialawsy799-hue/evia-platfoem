"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteButton({
  label,
  confirmMessage,
  onConfirm,
  className,
}: {
  label: string;
  confirmMessage: string;
  onConfirm: () => Promise<void>;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!window.confirm(confirmMessage)) return;
    setBusy(true);
    try {
      await onConfirm();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className={className}
      disabled={busy}
      onClick={onClick}
    >
      <Trash2 className="size-4" />
      {busy ? "جارٍ الحذف..." : label}
    </Button>
  );
}
