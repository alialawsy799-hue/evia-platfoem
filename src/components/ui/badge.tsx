import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: "default" | "outline" | "glow" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-violet-500/15 text-violet-200 border border-violet-400/20",
        variant === "outline" && "border border-white/15 text-slate-300",
        variant === "glow" && "bg-[#7C5CFF]/30 text-white shadow-[0_0_16px_rgba(124,92,255,0.45)]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
