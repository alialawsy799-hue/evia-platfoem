"use client";

import { useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { formatVideoLink, parseVideoLink, videoProviderLabel } from "@/lib/video";

export function VideoLinkField({
  id,
  name,
  label,
  defaultId,
  defaultHash,
  defaultProvider,
  value,
  onChange,
}: {
  id?: string;
  name?: string;
  label: string;
  defaultId?: string;
  defaultHash?: string;
  defaultProvider?: "vimeo" | "youtube" | "file";
  value?: string;
  onChange?: (value: string) => void;
}) {
  const initial = formatVideoLink({
    id: defaultId ?? "",
    hash: defaultHash,
    provider: defaultProvider,
  });
  const [inner, setInner] = useState(initial);
  const text = value ?? inner;
  const parsed = useMemo(() => parseVideoLink(text), [text]);

  function update(next: string) {
    if (onChange) onChange(next);
    else setInner(next);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <Input
          id={id}
          name={name}
          dir="ltr"
          placeholder="https://vimeo.com/123456789 أو رابط YouTube"
          value={text}
          onChange={(event) => update(event.target.value)}
          className="pl-10 pr-4"
        />
      </div>
      {text.trim() ? (
        parsed ? (
          <Badge className="w-fit">{videoProviderLabel(parsed.provider)} · تم ربط الفيديو</Badge>
        ) : (
          <p className="text-xs text-rose-300">الرابط غير صالح. الصق رابط Vimeo أو YouTube أو ملف mp4.</p>
        )
      ) : (
        <p className="text-xs text-slate-500">الصق رابط الفيديو فقط، دون رفع ملف من جهازك.</p>
      )}
    </div>
  );
}
