"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { emailsMatch } from "@/lib/auth/email";
import { assertRateLimit } from "@/lib/auth/rate-limit";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/admin/token";
import { adminEmail, adminPassword } from "@/lib/admin/constants";
import { readStore } from "@/lib/data/store";

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function adminLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  try {
    assertRateLimit(`admin:${ip}:${email}`, 8);
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "محاولات كثيرة" };
  }

  const expectedEmail = adminEmail();
  const expectedPassword = adminPassword();
  if (!expectedEmail || !expectedPassword || email !== expectedEmail || password !== expectedPassword) {
    const store = await readStore();
    const instructorAccount = (store.instructorAccounts ?? []).find((item) =>
      emailsMatch(item.email, email),
    );
    if (instructorAccount) {
      return {
        ok: false as const,
        error:
          "هذا حساب أستاذ، ليس حساب إدارة. ارجع للصفحة الرئيسية واضغط تسجيل الدخول.",
      };
    }
    return { ok: false as const, error: "بيانات الدخول غير صحيحة" };
  }

  const proto = (await headers()).get("x-forwarded-proto");
  const secure = proto === "https" || process.env.NODE_ENV === "production";
  try {
    (await cookies()).set(ADMIN_COOKIE, signAdminToken(), adminCookieOptions(secure));
  } catch {
    return { ok: false as const, error: "أضف EVIA_AUTH_SECRET في إعدادات الخادم" };
  }

  redirect("/admin");
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
