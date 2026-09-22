"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CurriculumEditor } from "@/components/admin/curriculum-editor";
import { ImageFileField } from "@/components/admin/image-file-field";
import { VideoLinkField } from "@/components/admin/video-link-field";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { updateCoursePricing, upsertCourse } from "@/lib/data/actions";
import { COURSE_CATEGORIES } from "@/lib/categories";
import type { Course, Instructor } from "@/lib/types";

export function CourseEditor({
  course,
  instructors,
}: {
  course: Course;
  instructors: Instructor[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    try {
      await updateCoursePricing(formData);
      setMessage("تم حفظ بيانات الكورس والفيديو التعريفي.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر الحفظ");
    }
  }

  async function publishNew() {
    const clone: Course = {
      ...course,
      id: `course-${Date.now()}`,
      slug: `course-${Date.now()}`,
      title: `${course.title} (نسخة)`,
      isPublished: true,
    };
    await upsertCourse(clone);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form action={onSubmit} className="space-y-4 rounded-2xl glass p-5">
        <input type="hidden" name="courseId" value={course.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field idPrefix={course.id} label="عنوان الكورس" name="title" defaultValue={course.title} />
          <div className="grid gap-2">
            <Label htmlFor={`instructor-${course.id}`}>المدرب</Label>
            <select
              id={`instructor-${course.id}`}
              name="instructorId"
              defaultValue={course.instructorId}
              className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
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
            <Label htmlFor={`category-${course.id}`}>التصنيف</Label>
            <select
              id={`category-${course.id}`}
              name="category"
              defaultValue={course.category}
              className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
            >
              {COURSE_CATEGORIES.filter((item) => item.id !== "all").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <ImageFileField
            id={`thumbnail-${course.id}`}
            name="thumbnail"
            label="رفع صورة الكورس من الحاسوب"
            previewClassName="size-16 rounded-xl"
          />
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200 md:col-span-2">
            <input
              type="checkbox"
              name="comingSoon"
              defaultChecked={Boolean(course.comingSoon)}
              className="size-4 accent-violet-500"
            />
            كورس قادم — إظهار Soon وإخفاء السعر
          </label>
          <Field
            idPrefix={course.id}
            label="السعر الأصلي (د.ع)"
            name="price"
            type="number"
            defaultValue={String(course.price)}
          />
          <Field
            idPrefix={course.id}
            label="سعر الخصم (اختياري، د.ع)"
            name="salePrice"
            type="number"
            defaultValue={course.salePrice ? String(course.salePrice) : ""}
            placeholder="اتركه فارغاً لإزالة الخصم"
          />
          <Field
            idPrefix={course.id}
            label="عدد الساعات"
            name="durationHours"
            type="number"
            defaultValue={String(course.durationHours)}
          />
          <Field
            idPrefix={course.id}
            label="عدد الطلاب الظاهر"
            name="studentCount"
            type="number"
            defaultValue={String(course.studentCount)}
          />
        </div>
        <VideoLinkField
          id={`intro-${course.id}`}
          name="introVideoUrl"
          label="رابط الفيديو التعريفي"
          defaultId={course.introVimeoId}
          defaultHash={course.introVimeoHash}
          defaultProvider={course.introVideoProvider}
        />
        <div className="grid gap-2">
          <Label htmlFor={`desc-${course.id}`}>الوصف</Label>
          <Textarea
            id={`desc-${course.id}`}
            name="description"
            defaultValue={course.description}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">حفظ التغييرات</Button>
          <Button type="button" variant="outline" onClick={publishNew}>
            نسخ كورس جديد
          </Button>
        </div>
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </form>
      <CurriculumEditor key={course.id} courseId={course.id} modules={course.modules} />
    </div>
  );
}

function Field({
  idPrefix,
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  idPrefix: string;
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  const id = `${idPrefix}-${name}`;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
