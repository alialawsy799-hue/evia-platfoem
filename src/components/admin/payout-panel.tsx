"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { settleInstructorBalance } from "@/lib/data/actions";
import { formatDateTime, formatPrice } from "@/lib/utils";
import type { Instructor, Payout } from "@/lib/types";

export function PayoutPanel({
  instructors,
  payouts,
}: {
  instructors: Instructor[];
  payouts: Payout[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(instructors);
  const [log, setLog] = useState(payouts);
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setRows(instructors);
    setLog(payouts);
  }, [instructors, payouts]);

  async function settle(instructorId: string) {
    setBusyId(instructorId);
    const form = new FormData();
    form.set("instructorId", instructorId);
    const result = await settleInstructorBalance(form);
    setRows((current) =>
      current.map((instructor) =>
        instructor.id === instructorId
          ? { ...instructor, balance: 0, pendingBalance: 0 }
          : instructor,
      ),
    );
    if (result.amount > 0) {
      setLog((current) => [
        {
          id: `pay-local-${Date.now()}`,
          instructorId,
          amount: result.amount,
          settledAt: new Date().toISOString(),
          note: "تسوية يدوية — تصفير الرصيد",
        },
        ...current,
      ]);
    }
    setNote(`تم تصفير الرصيد بمبلغ ${formatPrice(result.amount)}`);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {rows.map((instructor) => (
          <Card key={instructor.id} className="p-4">
            <p className="font-bold">{instructor.name}</p>
            <p className="text-sm text-muted-foreground">
              معلّق: {formatPrice(instructor.pendingBalance)}
            </p>
            <p className="text-sm text-muted-foreground">رصيد: {formatPrice(instructor.balance)}</p>
            <Button
              size="sm"
              className="mt-3 w-full"
              disabled={busyId === instructor.id || instructor.pendingBalance + instructor.balance <= 0}
              onClick={() => settle(instructor.id)}
            >
              {busyId === instructor.id ? "جارٍ التصفير..." : "تسوية / تصفير الرصيد"}
            </Button>
          </Card>
        ))}
      </div>
      {note ? <p className="text-sm text-emerald-300">{note}</p> : null}
      <div className="space-y-2">
        {log.map((payout) => (
          <Card key={payout.id} className="p-3 text-sm">
            <p>
              {formatPrice(payout.amount)} — {payout.note}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(payout.settledAt)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
