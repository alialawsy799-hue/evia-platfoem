import { hasDiscount, isComingSoon, type Course } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  course,
  size = "md",
}: {
  course: Pick<Course, "price" | "salePrice" | "comingSoon">;
  size?: "sm" | "md" | "lg";
}) {
  if (isComingSoon(course)) {
    return (
      <span
        className={cn(
          "inline-flex font-extrabold tracking-[0.18em] text-[#9D7BFF]",
          size === "sm" && "text-sm",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl",
        )}
      >
        Soon
      </span>
    );
  }

  const discounted = hasDiscount(course);
  return (
    <div className="flex items-baseline gap-2">
      <span
        dir="ltr"
        className={cn(
          "inline-block font-bold text-violet-400 tabular-nums",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl",
        )}
      >
        {formatPrice(discounted ? (course.salePrice as number) : course.price)}
      </span>
      {discounted ? (
        <span
          dir="ltr"
          className={cn(
            "inline-block text-slate-500 line-through tabular-nums",
            size === "lg" ? "text-lg" : "text-sm",
          )}
        >
          {formatPrice(course.price)}
        </span>
      ) : null}
    </div>
  );
}
