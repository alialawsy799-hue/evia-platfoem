"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { validateDiscountCode } from "@/lib/data/actions";
import { getEffectivePrice, type Course } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildEnrollmentMessage, whatsappHref } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

type Applied = {
  code: string;
  originalPrice: number;
  finalPrice: number;
  savings: number;
};

export function EnrollModal({
  open,
  onOpenChange,
  course,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Pick<Course, "id" | "title" | "price" | "salePrice">;
}) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<Applied | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const basePrice = getEffectivePrice(course);

  useEffect(() => {
    if (open && !user) setAuthOpen(true);
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      setCodeInput("");
      setApplied(null);
      setError("");
    }
  }, [open, course.id]);

  async function applyCode() {
    setBusy(true);
    setError("");
    try {
      const result = await validateDiscountCode(codeInput, course.id);
      if (!result.ok) {
        setApplied(null);
        setError(result.error);
        return;
      }
      setApplied({
        code: result.code,
        originalPrice: result.originalPrice,
        finalPrice: result.finalPrice,
        savings: result.savings,
      });
    } catch {
      setApplied(null);
      setError("تعذر التحقق من الكود حالياً");
    } finally {
      setBusy(false);
    }
  }

  const href = useMemo(() => {
    if (!user) return "#";
    return whatsappHref(
      buildEnrollmentMessage({
        name: user.fullName,
        email: user.email,
        courseTitle: course.title,
        price: basePrice,
        discountCode: applied?.code,
        finalPrice: applied?.finalPrice,
      }),
    );
  }, [user, course.title, basePrice, applied]);

  return (
    <>
      <Dialog open={open && !!user} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفعيل الاشتراك عبر واتساب</DialogTitle>
            <DialogDescription>
              سيتم إرسال رسالة جاهزة لفريق إيفيا لتفعيل وصولك إلى «{course.title}».
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-border bg-muted/60 p-4 text-sm">
            <p>
              <span className="text-muted-foreground">الاسم: </span>
              {user?.fullName}
            </p>
            <p>
              <span className="text-muted-foreground">البريد: </span>
              {user?.email}
            </p>
            <p>
              <span className="text-muted-foreground">الكورس: </span>
              {course.title}
            </p>
            <div className="flex items-baseline justify-between gap-3 pt-1">
              <span className="text-muted-foreground">السعر</span>
              <div className="text-left">
                <p className="font-bold text-primary" dir="ltr">
                  {formatPrice(applied?.finalPrice ?? basePrice)}
                </p>
                {applied && applied.savings > 0 ? (
                  <p className="text-xs text-muted-foreground line-through" dir="ltr">
                    {formatPrice(applied.originalPrice)}
                  </p>
                ) : null}
              </div>
            </div>
            {applied ? (
              <p className="text-xs text-emerald-300">
                تم تطبيق «{applied.code}» ووفّرت {formatPrice(applied.savings)}
              </p>
            ) : null}
          </div>
          <form
            className="grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void applyCode();
            }}
          >
            <Label htmlFor="discount-code">كود الخصم</Label>
            <div className="flex gap-2">
              <Input
                id="discount-code"
                dir="ltr"
                placeholder="EVIA20"
                value={codeInput}
                onChange={(event) => {
                  setCodeInput(event.target.value.toUpperCase());
                  setError("");
                  setApplied(null);
                }}
                className="uppercase tracking-widest"
              />
              <Button type="submit" variant="outline" className="shrink-0" disabled={busy || !codeInput.trim()}>
                {busy ? "..." : "تطبيق"}
              </Button>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </form>
          <Button asChild className="mt-2 w-full">
            <a href={href} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              تفعيل عبر واتساب
            </a>
          </Button>
        </DialogContent>
      </Dialog>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
