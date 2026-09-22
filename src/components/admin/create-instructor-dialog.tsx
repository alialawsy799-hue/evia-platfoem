"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { ImageFileField } from "@/components/admin/image-file-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { createInstructor } from "@/lib/data/actions";

export function CreateInstructorDialog() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadKey, setUploadKey] = useState(0);

  function resetForm() {
    formRef.current?.reset();
    setError("");
    setUploadKey((key) => key + 1);
  }

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await createInstructor(formData);
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر إضافة المدرس");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          إضافة مدرس جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مدرس جديد</DialogTitle>
          <DialogDescription>سيظهر المدرس فوراً في المنصة ولوحة الإدارة.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={onSubmit} className="grid gap-4">
          <Field label="الاسم" name="name" required />
          <Field label="المسمى الوظيفي" name="title" placeholder="مثل: مدرّب تصميم" />
          <Field label="سنوات الخبرة" name="yearsExperience" type="number" defaultValue="1" />
          <Field label="التخصصات" name="specialties" placeholder="البرمجة، التصميم" />
          <ImageFileField key={uploadKey} name="avatar" label="رفع صورة من الحاسوب" />
          <div className="grid gap-2">
            <Label htmlFor="bio">نبذة</Label>
            <Textarea id="bio" name="bio" placeholder="تعريف مختصر بالمدرّس" />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "جارٍ الحفظ..." : "حفظ المدرس"}
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
