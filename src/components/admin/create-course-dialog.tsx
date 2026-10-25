"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageFileField } from "@/components/admin/image-file-field";
import { VideoLinkField } from "@/components/admin/video-link-field";
import { Input, Label, Textarea } from "@/components/ui/input";
import { COURSE_CATEGORIES } from "@/lib/categories";
import { createCourse } from "@/lib/data/actions";
import type { Instructor } from "@/lib/types";

export function CreateCourseDialog({ instructors }: { instructors: Instructor[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await createCourse(formData);
      setOpen(false);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر إضافة الكورس");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          إضافة كورس جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[min(92vw,640px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة كورس جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات الكورس الأساسية. يمكنك لاحقاً لصق روابط دروس الفيديو من نفس التبويب.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4">
            <Field label="عنوان الكورس" name="title" required />
            <Field label="العنوان الفرعي" name="subtitle" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="instructorId">المدرس</Label>
                <select
                  id="instructorId"
                  name="instructorId"
                  className="h-11 rounded-xl border border-border bg-muted/60 px-3 text-sm"
                  defaultValue=""
                >
                  <option value="">بدون مدرس</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">التصنيف</Label>
                <select
                  id="category"
                  name="category"
                  className="h-11 rounded-xl border border-border bg-muted/60 px-3 text-sm"
                  defaultValue="programming"
                >
                  {COURSE_CATEGORIES.filter((item) => item.id !== "all").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">المستوى</Label>
                <select
                  id="level"
                  name="level"
                  className="h-11 rounded-xl border border-border bg-muted/60 px-3 text-sm"
                  defaultValue="مبتدئ"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-3 text-sm text-foreground sm:col-span-2">
                <input
                  type="checkbox"
                  name="comingSoon"
                  defaultChecked
                  className="size-4 accent-primary"
                />
                كورس قادم — إظهار Soon وإخفاء السعر
              </label>
              <Field label="السعر الأصلي (د.ع)" name="price" type="number" defaultValue="100000" />
              <Field label="سعر الخصم (اختياري، د.ع)" name="salePrice" type="number" />
              <Field label="عدد الساعات" name="durationHours" type="number" defaultValue="10" />
            </div>
            <VideoLinkField
              id="introVideoUrl"
              name="introVideoUrl"
              label="رابط الفيديو التعريفي"
            />
            <ImageFileField
              name="thumbnail"
              label="رفع صورة الكورس من الحاسوب"
              previewClassName="size-16 rounded-xl"
            />
            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea id="description" name="description" />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "جارٍ الحفظ..." : "حفظ الكورس"}
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
