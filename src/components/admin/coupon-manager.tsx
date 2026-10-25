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
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  deleteDiscountCode,
  toggleDiscountCode,
  upsertDiscountCode,
} from "@/lib/data/actions";
import { formatDiscountValue, isUgcCoupon } from "@/lib/discount";
import type { Course, DiscountCode } from "@/lib/types";
import { formatDate, formatNumber, formatPrice } from "@/lib/utils";

function expiryInputValue(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function CouponManager({
  courses,
  coupons,
}: {
  courses: Course[];
  coupons: DiscountCode[];
}) {
  const regularCoupons = coupons.filter((item) => !isUgcCoupon(item));
  const activeCount = regularCoupons.filter((item) => item.isActive).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            أنشئ كوداً بنسبة أو بمبلغ ثابت، حدّد الكورسات، وأوقف أو احذف الكود في أي وقت.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatNumber(activeCount)} مفعّل من أصل {formatNumber(regularCoupons.length)}
          </p>
        </div>
        <CouponDialog courses={courses} />
      </div>

      {regularCoupons.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[860px] text-right text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">الكود</th>
                <th className="px-4 py-3 font-medium">الخصم</th>
                <th className="px-4 py-3 font-medium">الكورسات</th>
                <th className="px-4 py-3 font-medium">الاستخدام</th>
                <th className="px-4 py-3 font-medium">الانتهاء</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {regularCoupons.map((coupon) => (
                <CouponRow key={coupon.id} coupon={coupon} courses={courses} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-bold">لا توجد أكواد خصم بعد</p>
          <p className="mt-2 text-sm text-muted-foreground">
            أنشئ أول كود ليظهر للطلاب في نافذة الاشتراك قبل إرسال واتساب.
          </p>
        </div>
      )}
    </div>
  );
}

function CouponRow({ coupon, courses }: { coupon: DiscountCode; courses: Course[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const expired = Boolean(coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now());
  const exhausted = coupon.maxUses != null && coupon.usedCount >= coupon.maxUses;
  const courseLabel =
    coupon.courseIds.length === 0
      ? "كل الكورسات"
      : coupon.courseIds
          .map((id) => courses.find((course) => course.id === id)?.title ?? id)
          .join("، ");

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
        <p className="font-bold tracking-wide" dir="ltr">
          {coupon.code}
        </p>
        {coupon.note ? <p className="mt-0.5 text-xs text-muted-foreground">{coupon.note}</p> : null}
      </td>
      <td className="px-4 py-3 tabular-nums" dir="ltr">
        {coupon.type === "fixed" ? formatPrice(coupon.value) : formatDiscountValue(coupon)}
      </td>
      <td className="max-w-[220px] px-4 py-3 text-muted-foreground">
        <span className="line-clamp-2">{courseLabel}</span>
      </td>
      <td className="px-4 py-3 tabular-nums text-muted-foreground" dir="ltr">
        {formatNumber(coupon.usedCount)}
        {coupon.maxUses != null ? ` / ${formatNumber(coupon.maxUses)}` : " / ∞"}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {coupon.expiresAt ? formatDate(coupon.expiresAt) : "بدون انتهاء"}
      </td>
      <td className="px-4 py-3">
        {expired ? (
          <Badge variant="outline">منتهٍ</Badge>
        ) : exhausted ? (
          <Badge variant="outline">مستنفد</Badge>
        ) : coupon.isActive ? (
          <Badge>مفعّل</Badge>
        ) : (
          <Badge variant="outline">متوقف</Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <CouponDialog courses={courses} coupon={coupon} />
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onToggle}>
            <Power className="size-4" />
            {coupon.isActive ? "إيقاف" : "تفعيل"}
          </Button>
          <ConfirmDeleteButton
            label="حذف"
            confirmMessage={`حذف كود ${coupon.code}؟ لن يتمكن الطلاب من استخدامه بعد ذلك.`}
            onConfirm={() => deleteDiscountCode(coupon.id)}
          />
        </div>
      </td>
    </tr>
  );
}

function CouponDialog({
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
      setError(caught instanceof Error ? caught.message : "تعذر حفظ الكود");
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
            إضافة كود خصم
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{coupon ? `تعديل ${coupon.code}` : "كود خصم جديد"}</DialogTitle>
          <DialogDescription>
            يظهر الكود للطلاب في نافذة الاشتراك، ويُحسب السعر النهائي قبل إرسال واتساب.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={onSubmit} className="grid gap-4">
          {coupon ? <input type="hidden" name="id" value={coupon.id} /> : null}
          <div className="grid gap-2">
            <Label htmlFor={`code-${coupon?.id ?? "new"}`}>الكود</Label>
            <Input
              id={`code-${coupon?.id ?? "new"}`}
              name="code"
              required
              dir="ltr"
              placeholder="EVIA20"
              defaultValue={coupon?.code ?? ""}
              className="uppercase tracking-widest"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`type-${coupon?.id ?? "new"}`}>نوع الخصم</Label>
              <select
                id={`type-${coupon?.id ?? "new"}`}
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
              <Label htmlFor={`value-${coupon?.id ?? "new"}`}>
                {type === "percent" ? "النسبة %" : "المبلغ (د.ع)"}
              </Label>
              <Input
                id={`value-${coupon?.id ?? "new"}`}
                name="value"
                type="number"
                min={1}
                max={type === "percent" ? 100 : undefined}
                required
                defaultValue={coupon?.value ?? (type === "percent" ? 10 : "")}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`maxUses-${coupon?.id ?? "new"}`}>حد الاستخدام</Label>
              <Input
                id={`maxUses-${coupon?.id ?? "new"}`}
                name="maxUses"
                type="number"
                min={1}
                placeholder="غير محدود"
                defaultValue={coupon?.maxUses ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`expiresAt-${coupon?.id ?? "new"}`}>تاريخ الانتهاء</Label>
              <Input
                id={`expiresAt-${coupon?.id ?? "new"}`}
                name="expiresAt"
                type="date"
                defaultValue={expiryInputValue(coupon?.expiresAt ?? null)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`note-${coupon?.id ?? "new"}`}>ملاحظة داخلية</Label>
            <Textarea
              id={`note-${coupon?.id ?? "new"}`}
              name="note"
              placeholder="مثل: حملة رمضان"
              defaultValue={coupon?.note ?? ""}
            />
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
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "جارٍ الحفظ..." : coupon ? "حفظ التعديلات" : "إنشاء الكود"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
