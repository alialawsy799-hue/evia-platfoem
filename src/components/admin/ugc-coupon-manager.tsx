"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Power } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import {
  deleteDiscountCode,
  toggleDiscountCode,
  upsertDiscountCode,
} from "@/lib/data/actions";
import { formatDiscountValue, isUgcCoupon, uniqueStudentsForCoupon } from "@/lib/discount";
import type { Course, DiscountCode, Enrollment, Profile } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function UgcCouponManager({
  courses,
  coupons,
  enrollments,
  profiles,
}: {
  courses: Course[];
  coupons: DiscountCode[];
  enrollments: Enrollment[];
  profiles: Profile[];
}) {
  const ugcCoupons = coupons.filter((item) => isUgcCoupon(item));
  const rows = ugcCoupons.map((coupon) => {
    const studentIds = uniqueStudentsForCoupon(coupon, enrollments);
    return { coupon, studentIds };
  });
  const totalStudents = new Set(rows.flatMap((row) => row.studentIds)).size;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            كود خصم مستقل لكل مشهور. يُحتسب الطالب هنا فقط إذا سُجّل في المنصة واستُخدم كود هذا المشهور عند التفعيل.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(ugcCoupons.length)} مشهور · {formatNumber(totalStudents)} طالب استخدم كود UGC
          </p>
        </div>
        <UgcCouponDialog courses={courses} />
      </div>

      {rows.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">المشهور</th>
                <th className="px-4 py-3 font-medium">كود الخصم</th>
                <th className="px-4 py-3 font-medium">الخصم</th>
                <th className="px-4 py-3 font-medium">الطلاب المسجّلون بالكود</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ coupon, studentIds }) => (
                <UgcCouponRow
                  key={coupon.id}
                  coupon={coupon}
                  courses={courses}
                  studentIds={studentIds}
                  profiles={profiles}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-bold">لا توجد كوبونات UGC بعد</p>
          <p className="mt-2 text-sm text-muted-foreground">
            أضف مشهوراً وكوده الخاص قبل بدء الحملة.
          </p>
        </div>
      )}
    </div>
  );
}

function UgcCouponRow({
  coupon,
  courses,
  studentIds,
  profiles,
}: {
  coupon: DiscountCode;
  courses: Course[];
  studentIds: string[];
  profiles: Profile[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const students = studentIds
    .map((id) => profiles.find((profile) => profile.id === id))
    .filter((item): item is Profile => Boolean(item));

  async function onToggle() {
    setBusy(true);
    try {
      await toggleDiscountCode(coupon.id);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <p className="font-bold">{coupon.influencerName || "—"}</p>
      </td>
      <td className="px-4 py-3">
        <p className="font-bold tracking-wide" dir="ltr">
          {coupon.code}
        </p>
      </td>
      <td className="px-4 py-3 tabular-nums" dir="ltr">
        {formatDiscountValue(coupon)}
      </td>
      <td className="px-4 py-3">
        <p className="font-black tabular-nums">{formatNumber(studentIds.length)}</p>
        {students.length ? (
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {students
              .slice(0, 3)
              .map((item) => item.fullName || item.email)
              .join("، ")}
            {students.length > 3 ? ` +${formatNumber(students.length - 3)}` : ""}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">لا يوجد استخدام بعد</p>
        )}
      </td>
      <td className="px-4 py-3">
        {coupon.isActive ? <Badge>مفعّل</Badge> : <Badge variant="outline">متوقف</Badge>}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <UgcCouponDialog courses={courses} coupon={coupon} />
          <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={onToggle}>
            <Power className="size-4" />
            {coupon.isActive ? "إيقاف" : "تفعيل"}
          </Button>
          <ConfirmDeleteButton
            confirmMessage={`حذف كود ${coupon.code} للمشهور ${coupon.influencerName ?? ""}؟`}
            onConfirm={() => deleteDiscountCode(coupon.id)}
          />
        </div>
      </td>
    </tr>
  );
}

function UgcCouponDialog({
  courses,
  coupon,
}: {
  courses: Course[];
  coupon?: DiscountCode;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [allCourses, setAllCourses] = useState(coupon ? coupon.courseIds.length === 0 : true);
  const [type, setType] = useState(coupon?.type ?? "percent");
  const selected = useMemo(() => new Set(coupon?.courseIds ?? []), [coupon]);

  function reset() {
    formRef.current?.reset();
    setError("");
    setAllCourses(coupon ? coupon.courseIds.length === 0 : true);
    setType(coupon?.type ?? "percent");
  }

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      formData.set("channel", "ugc");
      if (allCourses) {
        formData.delete("courseIds");
        formData.set("allCourses", "on");
      } else {
        formData.delete("allCourses");
      }
      await upsertDiscountCode(formData);
      setOpen(false);
      reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر حفظ الكوبون");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        {coupon ? (
          <Button type="button" size="sm" variant="outline">
            <Pencil className="size-4" />
            تعديل
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            إضافة كوبون UGC
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? `تعديل ${coupon.influencerName}` : "كوبون UGC جديد"}</DialogTitle>
          <DialogDescription>
            اسم المشهور يظهر في لوحة الإدارة، والكود يُستخدم في نافذة الاشتراك مثل أي كود خصم.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={onSubmit} className="grid gap-4">
          {coupon ? <input type="hidden" name="id" value={coupon.id} /> : null}
          <input type="hidden" name="channel" value="ugc" />
          <div className="grid gap-2">
            <Label htmlFor={`influencer-${coupon?.id ?? "new"}`}>اسم المشهور</Label>
            <Input
              id={`influencer-${coupon?.id ?? "new"}`}
              name="influencerName"
              required
              placeholder="اسم المشهور"
              defaultValue={coupon?.influencerName ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`ugc-code-${coupon?.id ?? "new"}`}>كود الخصم</Label>
            <Input
              id={`ugc-code-${coupon?.id ?? "new"}`}
              name="code"
              required
              dir="ltr"
              placeholder="AHMED20"
              defaultValue={coupon?.code ?? ""}
              className="uppercase tracking-widest"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`ugc-type-${coupon?.id ?? "new"}`}>نوع الخصم</Label>
              <select
                id={`ugc-type-${coupon?.id ?? "new"}`}
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value === "fixed" ? "fixed" : "percent")}
                className="h-11 rounded-xl border border-border bg-muted/60 px-3 text-sm"
              >
                <option value="percent">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`ugc-value-${coupon?.id ?? "new"}`}>
                {type === "percent" ? "النسبة %" : "المبلغ (د.ع)"}
              </Label>
              <Input
                id={`ugc-value-${coupon?.id ?? "new"}`}
                name="value"
                type="number"
                min={1}
                max={type === "percent" ? 100 : undefined}
                required
                defaultValue={coupon?.value ?? (type === "percent" ? 10 : "")}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={coupon?.isActive ?? true}
              className="size-4 accent-primary"
            />
            الكود مفعّل فور الحفظ
          </label>
          <div className="grid gap-2">
            <Label>ينطبق على</Label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={allCourses}
                onChange={(event) => setAllCourses(event.target.checked)}
                className="size-4 accent-primary"
              />
              كل الكورسات
            </label>
            {!allCourses ? (
              <div className="grid max-h-40 gap-2 overflow-y-auto rounded-xl border border-border bg-muted/60 p-3">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      name="courseIds"
                      value={course.id}
                      defaultChecked={selected.has(course.id)}
                      className="size-4 accent-primary"
                    />
                    {course.title}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "جارٍ الحفظ..." : coupon ? "حفظ التعديلات" : "إنشاء كوبون UGC"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
