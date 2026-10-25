"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-[min(640px,calc(100%-1.5rem))] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-black">تعذر تحميل الصفحة</h1>
      <p className="mt-3 text-sm text-slate-400">حدث خطأ في الخادم. أعد المحاولة بعد ثوانٍ.</p>
      <Button className="mt-6" type="button" onClick={() => reset()}>
        إعادة المحاولة
      </Button>
    </main>
  );
}
