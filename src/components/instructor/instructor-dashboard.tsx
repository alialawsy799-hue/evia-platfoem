"use client";

import { useMemo } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { useAuth } from "@/components/auth/auth-provider";
import {
  MonthlyReceiptForm,
  ReceiptHistory,
} from "@/components/admin/instructor-account-manager";
import {
  countInstructorStudents,
  currentMonthKey,
  receiptsForInstructor,
} from "@/lib/instructor-stats";
import { formatDate, formatNumber } from "@/lib/utils";
import { emailsMatch } from "@/lib/auth/email";
import type {
  Course,
  Enrollment,
  Instructor,
  InstructorAccount,
  MonthlyReceipt,
} from "@/lib/types";

export function InstructorDashboard({
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
  const { user } = useAuth();
  const month = currentMonthKey();
  const instructor = useMemo(() => {
    if (!user) return null;
    return (
      instructors.find((item) => item.id === user.id) ||
      instructors.find((item) =>
        accounts.some(
          (account) =>
            account.instructorId === item.id && emailsMatch(account.email, user.email),
        ),
      ) ||
      null
    );
  }, [user, instructors, accounts]);

  const monthStudents = instructor
    ? countInstructorStudents(instructor.id, courses, enrollments, month)
    : 0;
  const totalStudents = instructor
    ? countInstructorStudents(instructor.id, courses, enrollments)
    : 0;
  const instructorReceipts = instructor
    ? receiptsForInstructor(receipts, instructor.id)
    : [];

  return (
    <RoleGate allow={["instructor"]}>
      <main className="mx-auto w-[min(1000px,calc(100%-1.5rem))] py-10">
        <h1 className="mb-6 text-3xl font-black">لوحة المدرّس</h1>
        {user ? (
          <div id="profile" className="mb-5 rounded-2xl glass p-5">
            <p className="text-xs font-semibold text-primary">حساب الأستاذ</p>
            <p className="mt-1 text-lg font-bold">{instructor?.name || user.fullName}</p>
            <p className="mt-1 text-sm text-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              تاريخ الدخول: {user.joinedAt ? formatDate(user.joinedAt) : "—"}
            </p>
          </div>
        ) : null}

        {!instructor ? (
          <p className="rounded-2xl glass p-6 text-muted-foreground">
            لم يتم ربط حسابك بملف مدرّس بعد. تواصل مع الإدارة لإنشاء حساب الأستاذ.
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Metric label="عدد الطلاب لهذا الشهر" value={formatNumber(monthStudents)} />
              <Metric label="عدد الطلاب الكلي" value={formatNumber(totalStudents)} />
            </div>
            <div className="mt-6 rounded-2xl glass p-5">
              <MonthlyReceiptForm instructorId={instructor.id} month={month} />
            </div>
            <div className="mt-6 rounded-2xl glass p-5">
              <ReceiptHistory receipts={instructorReceipts} />
            </div>
          </>
        )}
      </main>
    </RoleGate>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl glass p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tabular-nums">{value}</p>
    </div>
  );
}
