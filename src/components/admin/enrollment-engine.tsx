"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { activateEnrollment } from "@/lib/data/actions";
import { formatNumber } from "@/lib/utils";
import type { Course, Enrollment, Profile } from "@/lib/types";

export function EnrollmentEngine({
  courses,
  enrollments,
  profiles,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  profiles: Profile[];
}) {
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return profiles.filter((item) => item.role === "student").slice(0, 6);
    return profiles.filter(
      (item) =>
        item.email.toLowerCase().includes(needle) ||
        item.fullName.toLowerCase().includes(needle),
    );
  }, [profiles, query]);

  async function action(formData: FormData) {
    setStatus("");
    try {
      const result = await activateEnrollment(formData);
      setStatus(`تم تفعيل الوصول للحساب ${result.userId}`);
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : "تعذر التفعيل");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-bold">تفعيل جديد</h2>
        <div className="grid gap-2">
          <Label htmlFor="email">بريد الزبون</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="student@evia.com"
            required
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="courseId">الكورس</Label>
          <select
            id="courseId"
            name="courseId"
            className="h-11 rounded-xl border border-border bg-muted/60 px-3 text-sm"
            required
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discountCode">كود الخصم (اختياري)</Label>
          <Input
            id="discountCode"
            name="discountCode"
            dir="ltr"
            placeholder="EVIA20"
            className="uppercase tracking-widest"
          />
        </div>
        <Button type="submit">تفعيل الوصول</Button>
        {status ? (
          <p className={`text-sm ${status.startsWith("تم") ? "text-emerald-300" : "text-rose-300"}`}>
            {status}
          </p>
        ) : null}
      </form>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-lg font-bold">نتائج البحث</h2>
        <ul className="space-y-2 text-sm">
          {matches.length ? (
            matches.map((profile) => {
              const count = enrollments.filter((item) => item.userId === profile.id).length;
              return (
                <li
                  key={profile.id}
                  className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2"
                >
                  <span>
                    <span className="block font-medium">{profile.fullName}</span>
                    <span className="text-xs text-muted-foreground">{profile.email}</span>
                  </span>
                  <span className="text-xs text-primary">{formatNumber(count)} كورس</span>
                </li>
              );
            })
          ) : (
            <li className="text-muted-foreground">لا توجد نتائج. يمكنك التفعيل ببريد جديد مباشرة.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
