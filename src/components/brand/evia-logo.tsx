import Image from "next/image";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: 32, fullW: 96, fullH: 40 },
  md: { mark: 44, fullW: 156, fullH: 64 },
  lg: { mark: 72, fullW: 240, fullH: 98 },
} as const;

export function EviaLogo({
  variant = "horizontal",
  size = "md",
  className,
}: {
  variant?: "mark" | "horizontal" | "stacked";
  size?: keyof typeof SIZES;
  className?: string;
  showWordmark?: boolean;
}) {
  const scale = SIZES[size];

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex p-1.5", className)}>
        <Image
          src="/brand/evia-icon.png"
          alt={SITE.name}
          width={scale.mark}
          height={Math.round(scale.mark * 1.16)}
          className="max-w-full object-contain"
          style={{ width: scale.mark, height: "auto" }}
          priority={size !== "sm"}
          unoptimized
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex p-1.5", className)}>
      <Image
        src="/brand/evia-logo-full.png"
        alt={`${SITE.name} ${SITE.nameAr}`}
        width={scale.fullW}
        height={scale.fullH}
        className="h-auto w-full object-contain"
        style={{ maxWidth: scale.fullW, height: "auto" }}
        priority={size !== "sm"}
        unoptimized
      />
    </span>
  );
}
