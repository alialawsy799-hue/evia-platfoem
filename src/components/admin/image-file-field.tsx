"use client";

import { useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ImageFileField({
  id,
  name,
  label,
  hint = "اختر صورة من الحاسوب، وليس رابطاً",
  previewClassName,
}: {
  id?: string;
  name: string;
  label: string;
  hint?: string;
  previewClassName?: string;
}) {
  const inputId = id ?? name;
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-violet-400/40 bg-violet-500/5 p-3">
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10",
            previewClassName,
          )}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <ImageUp className="size-5 text-violet-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            id={inputId}
            name={name}
            type="file"
            accept="image/*"
            className="block w-full cursor-pointer text-sm text-slate-300 file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-500"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileName(file?.name ?? "");
              setPreview((current) => {
                if (current) URL.revokeObjectURL(current);
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
          <p className="mt-1 truncate text-xs text-slate-400">{fileName || hint}</p>
        </div>
      </div>
    </div>
  );
}
