import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(130,80,161,0.28)] hover:bg-[#6f428c] hover:shadow-[0_10px_28px_rgba(130,80,161,0.36)]",
        outline:
          "border border-primary/40 bg-white text-primary hover:border-primary hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        dark: "bg-muted border border-border text-foreground hover:border-primary/40",
        destructive:
          "border border-rose-500/30 bg-rose-50 text-rose-700 hover:border-rose-400/50 hover:bg-rose-100",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-5 text-sm sm:px-7 sm:text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
