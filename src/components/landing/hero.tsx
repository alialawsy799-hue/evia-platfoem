"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EviaLogo } from "@/components/brand/evia-logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[78vh] w-[min(1100px,calc(100%-1.5rem))] flex-col items-center justify-center pt-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-[8%] top-24 hidden rounded-2xl glass px-4 py-3 text-right md:block"
      >
        <p className="text-lg font-bold">4.9 تقييم</p>
        <p className="text-xs text-slate-400">متوسط رضا الطلاب</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute left-[8%] top-40 hidden rounded-2xl glass px-4 py-3 text-right md:block"
      >
        <p className="text-lg font-bold">+15K طالب</p>
        <p className="text-xs text-slate-400">مجتمع يتعلم الآن</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <EviaLogo variant="stacked" size="lg" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl text-3xl font-bold leading-tight md:text-[32px] md:leading-snug"
      >
        {SITE.tagline}
      </motion.h1>
      <p className="mt-4 max-w-xl text-base font-normal text-[#A8A0C0] md:text-lg">
        منصة عربية حديثة للكورسات الاحترافية، بتجربة زجاجية داكنة وحماية متقدمة لمحتوى الفيديو.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/courses">استكشف الكورسات</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/paths">مسارات التعلم</Link>
        </Button>
      </div>
    </section>
  );
}
