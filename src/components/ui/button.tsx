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
          "bg-gradient-to-l from-[#7C5CFF] to-[#9D7BFF] text-white shadow-[0_8px_32px_rgba(124,92,255,0.45)] hover:shadow-[0_10px_40px_rgba(157,123,255,0.6)] hover:brightness-110",
        outline:
          "border border-[#9D7BFF]/50 bg-transparent text-white hover:border-[#9D7BFF] hover:shadow-[0_0_24px_rgba(124,92,255,0.28)]",
        ghost: "text-slate-200 hover:bg-white/5",
        dark: "bg-[#12101c] border border-white/10 text-white hover:border-[#9D7BFF]/40 hover:shadow-[0_0_20px_rgba(124,92,255,0.2)]",
        destructive:
          "border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400/50 hover:bg-rose-500/20",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
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
