"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EviaLogo } from "@/components/brand/evia-logo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[72vh] w-[min(1100px,calc(100%-1.5rem))] flex-col items-center justify-center pt-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <span className="sm:hidden">
          <EviaLogo variant="stacked" size="md" />
        </span>
        <span className="hidden sm:inline-flex">
          <EviaLogo variant="stacked" size="lg" />
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-[40px] md:leading-snug"
      >
        {SITE.tagline}
      </motion.h1>
      <p className="mt-4 max-w-xl text-base font-normal text-muted-foreground md:text-lg">
        منصة عربية حديثة للكورسات الاحترافية، بتجربة واضحة وحماية متقدمة لمحتوى الفيديو.
      </p>
      <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/courses">استكشف الكورسات</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/paths">مسارات التعلم</Link>
        </Button>
      </div>
    </section>
  );
}
