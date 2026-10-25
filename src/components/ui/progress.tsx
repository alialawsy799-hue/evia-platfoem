"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { value?: number }) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-gradient-to-l from-primary to-secondary transition-all"
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
