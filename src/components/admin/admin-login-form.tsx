"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { adminLogin } from "@/lib/admin/auth";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    const result = await adminLogin(formData);
    if (result && !result.ok) {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">البريد الإداري</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          autoComplete="username"
          placeholder="بريد الإدارة"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "جارٍ الدخول..." : "دخول لوحة الإدارة"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        حساب المدرّس لا يدخل من هنا. استخدم تسجيل الدخول في الصفحة الرئيسية.
      </p>
    </form>
  );
}
