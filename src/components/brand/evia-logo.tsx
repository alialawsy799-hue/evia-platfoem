import Image from "next/image";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: 28, text: "text-sm", sub: "text-[10px]" },
  md: { mark: 40, text: "text-base", sub: "text-[11px]" },
  lg: { mark: 72, text: "text-3xl", sub: "text-base" },
} as const;

export function EviaLogo({
  variant = "horizontal",
  size = "md",
  className,
  showWordmark = true,
}: {
  variant?: "mark" | "horizontal" | "stacked";
  size?: keyof typeof SIZES;
  className?: string;
  showWordmark?: boolean;
}) {
  const scale = SIZES[size];
  const markHeight = Math.round(scale.mark * 1.1);
  const mark = (
    <Image
      src="/brand/evia-logo.png"
      alt={SITE.name}
      width={scale.mark}
      height={markHeight}
      className="relative shrink-0 object-contain"
      style={{ width: scale.mark, height: "auto" }}
      priority={size !== "sm"}
      unoptimized
    />
  );

  if (variant === "mark" || !showWordmark) return <span className={className}>{mark}</span>;

  const wordmark = (
    <span className="text-right leading-none">
      <span className={cn("block font-extrabold tracking-[0.22em] text-white", scale.text)}>
        {SITE.name}
      </span>
      <span className={cn("mt-1 block font-medium text-[#9D7BFF]", scale.sub)}>{SITE.nameAr}</span>
    </span>
  );

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-3", className)}>
        {mark}
        {wordmark}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      {wordmark}
    </span>
  );
}
