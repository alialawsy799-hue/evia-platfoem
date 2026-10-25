import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        type === "file"
          ? "block w-full cursor-pointer text-sm text-muted-foreground file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#6f428c]"
          : "flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("text-sm font-medium text-foreground", className)} {...props} />
  );
}

export { Input, Textarea, Label };
