"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

export function AuthModal({
  open,
  onOpenChange,
  initialError = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialError?: string;
}) {
  const { signInGoogle, signInEmail, signUpEmail } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  function reset() {
    setError("");
    setPassword("");
  }

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  async function handleEmail(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const profile =
        mode === "signup"
          ? await signUpEmail(email, password, fullName)
          : await signInEmail(email, password);
      onOpenChange(false);
      reset();
      router.push(profile.role === "instructor" ? "/instructor" : "/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError("");
    try {
      await signInGoogle();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر الدخول عبر Google");
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "أدخل بريدك وكلمة المرور للوصول إلى حسابك."
              : "أنشئ حساباً جديداً للبدء في التعلّم."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEmail} className="grid gap-3">
          {mode === "signup" ? (
            <div className="grid gap-2">
              <Label htmlFor="auth-name">الاسم</Label>
              <Input
                id="auth-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="اسمك الكامل"
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="auth-email">البريد الإلكتروني</Label>
            <Input
              id="auth-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auth-password">كلمة المرور</Label>
            <Input
              id="auth-password"
              type="password"
              dir="ltr"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy
              ? "جارٍ التحقق..."
              : mode === "login"
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
          </Button>
        </form>
        <div className="my-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" />
          أو
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full"
        >
          <GoogleMark />
          {busy ? "جارٍ التحويل إلى Google..." : "أو سجّل عن طريق Google"}
        </Button>
        <button
          type="button"
          className="text-center text-sm text-primary hover:text-foreground"
          onClick={() => {
            setMode((current) => (current === "login" ? "signup" : "login"));
            setError("");
          }}
        >
          {mode === "login" ? "ليس لديك حساب؟ إنشاء حساب" : "لديك حساب؟ تسجيل الدخول"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
