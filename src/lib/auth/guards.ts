import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readAuthSession } from "@/lib/auth/session";
import type { Profile } from "@/lib/types";

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("غير مصرح");
  }
}

export async function requireUser(): Promise<Profile> {
  const user = await readAuthSession();
  if (!user) throw new Error("يجب تسجيل الدخول");
  return user;
}

export async function requireInstructor(): Promise<Profile> {
  const user = await requireUser();
  if (user.role !== "instructor") throw new Error("غير مصرح");
  return user;
}

export async function requireAdminOrInstructor(): Promise<
  { kind: "admin" } | { kind: "instructor"; user: Profile }
> {
  if (await isAdminAuthenticated()) return { kind: "admin" };
  return { kind: "instructor", user: await requireInstructor() };
}
