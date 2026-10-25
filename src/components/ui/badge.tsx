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
        variant === "default" && "border border-primary/15 bg-muted text-primary",
        variant === "outline" && "border border-border text-muted-foreground",
        variant === "glow" && "bg-primary text-white",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
