"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import {
  createInstructorAccount,
  confirmInstructorMonthlyReceipt,
  deleteInstructorAccount,
} from "@/lib/data/actions";
import {
  countInstructorStudents,
  currentMonthKey,
  monthLabel,
  receiptsForInstructor,
} from "@/lib/instructor-stats";
import { formatDateTime, formatNumber, formatPrice } from "@/lib/utils";
import type { Course, Enrollment, Instructor, InstructorAccount, MonthlyReceipt } from "@/lib/types";

export function InstructorAccountManager({
  instructors,
  accounts,
  courses,
  enrollments,
  receipts,
}: {
  instructors: Instructor[];
  accounts: InstructorAccount[];
  courses: Course[];
  enrollments: Enrollment[];
  receipts: MonthlyReceipt[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const month = currentMonthKey();
  const unused = instructors.filter(
    (instructor) => !accounts.some((account) => account.instructorId === instructor.id),
  );

  async function onCreate(formData: FormData) {
    setBusy(true);
    setMessage("");
    try {
      const result = await createInstructorAccount(formData);
      setMessage(`تم إنشاء حساب ${result.email}`);
      router.refresh();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "تعذر إنشاء الحساب");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        action={onCreate}
        className="space-y-4 rounded-2xl border border-white/10 bg-[#121824] p-5"
      >
        <h2 className="text-lg font-bold">إنشاء حساب مدرّس</h2>
        <p className="text-sm text-slate-400">
          أنشئ بريداً وكلمة مرور للمدرّس حتى يدخل لوحة الأستاذ من الموقع.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="instructorId">المدرّس</Label>
            <select
              id="instructorId"
              name="instructorId"
              required
              className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                اختر المدرّس
              </option>
              {unused.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" dir="ltr" required placeholder="teacher@evia.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              dir="ltr"
              required
              minLength={6}
              placeholder="٦ أحرف على الأقل"
            />
          </div>
        </div>
        <Button type="submit" disabled={busy || unused.length === 0}>
          {busy ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
        </Button>
        {unused.length === 0 ? (
          <p className="text-sm text-slate-500">كل المدرّسين لديهم حسابات حالياً.</p>
        ) : null}
        {message ? <p className="text-sm text-violet-300">{message}</p> : null}
      </form>

      {accounts.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#121824] p-6 text-slate-400">
          لا توجد حسابات أساتذة بعد. أنشئ حساباً من النموذج أعلاه.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {accounts.map((account) => {
            const instructor = instructors.find((item) => item.id === account.instructorId);
            if (!instructor) return null;
            const monthStudents = countInstructorStudents(
              instructor.id,
              courses,
              enrollments,
              month,
            );
            const totalStudents = countInstructorStudents(instructor.id, courses, enrollments);
            const instructorReceipts = receiptsForInstructor(receipts, instructor.id);
            return (
              <article
                key={account.id}
                className="space-y-4 rounded-2xl border border-white/10 bg-[#121824] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{instructor.name}</h3>
                    <p className="text-sm text-violet-300" dir="ltr">
                      {account.email}
                    </p>
                  </div>
                  <ConfirmDeleteButton
                    label="حذف الحساب"
                    confirmMessage={`حذف حساب «${instructor.name}»؟ سيُلغى دخوله للمنصة دون حذف ملفه كمدرب.`}
                    onConfirm={() => deleteInstructorAccount(account.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <Stat label="طلاب هذا الشهر" value={formatNumber(monthStudents)} />
                  <Stat label="الطلاب الكلي" value={formatNumber(totalStudents)} />
                </div>
                <MonthlyReceiptForm instructorId={instructor.id} month={month} />
                <ReceiptHistory receipts={instructorReceipts} />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MonthlyReceiptForm({
  instructorId,
  month,
}: {
  instructorId: string;
  month: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [formKey, setFormKey] = useState(0);

  async function onConfirm(formData: FormData) {
    setBusy(true);
    setStatus("");
    try {
      const result = await confirmInstructorMonthlyReceipt(formData);
      setStatus(`تم تسجيل استلام ${formatPrice(result.amount)} لشهر ${monthLabel(result.month)}`);
      setFormKey((value) => value + 1);
      router.refresh();
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "تعذر تسجيل الاستلام");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form key={formKey} action={onConfirm} className="space-y-3">
      <input type="hidden" name="instructorId" value={instructorId} />
      <p className="text-xs text-slate-500">أرباح شهر {monthLabel(month)}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Button type="submit" disabled={busy} className="sm:shrink-0">
          {busy ? "جارٍ الحفظ..." : "تم استلام الأرباح لهذا الشهر"}
        </Button>
        <Input
          name="amount"
          type="number"
          min={1}
          step={1}
          required
          dir="ltr"
          placeholder="المبلغ من نسبته (د.ع)"
          className="sm:flex-1"
        />
      </div>
      {status ? <p className="text-sm text-violet-300">{status}</p> : null}
    </form>
  );
}

export function ReceiptHistory({ receipts }: { receipts: MonthlyReceipt[] }) {
  const total = receipts.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold">سجل الأرباح المستلمة</h3>
        <p className="text-sm font-black tabular-nums text-emerald-300">
          الإجمالي: {formatPrice(total)}
        </p>
      </div>
      {receipts.length === 0 ? (
        <p className="text-sm text-slate-500">لا توجد أرباح مسجّلة بعد.</p>
      ) : (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
          {receipts.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-bold tabular-nums">{formatPrice(item.amount)}</p>
                <p className="text-xs text-slate-500">
                  شهر {monthLabel(item.month)} · {formatDateTime(item.receivedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-xl font-black tabular-nums">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
