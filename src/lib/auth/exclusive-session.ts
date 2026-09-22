import { randomBytes } from "node:crypto";
import { adminEmail } from "@/lib/admin/constants";
import { emailsMatch, findByEmail, normalizeEmail } from "@/lib/auth/email";
import type { AuthSession, CatalogState } from "@/lib/types";

export const EMAIL_IN_USE_MESSAGE = "هذا البريد مستخدم مسبقاً. كل إيميل مخصص لشخص واحد فقط.";

export function rotateAuthSession(store: CatalogState, email: string) {
  const normalized = normalizeEmail(email);
  const token = randomBytes(32).toString("hex");
  const next: AuthSession = {
    email: normalized,
    token,
    updatedAt: new Date().toISOString(),
  };
  store.authSessions = [
    ...(store.authSessions ?? []).filter((item) => !emailsMatch(item.email, normalized)),
    next,
  ];
  return token;
}

export function clearAuthSession(store: CatalogState, email: string) {
  store.authSessions = (store.authSessions ?? []).filter(
    (item) => !emailsMatch(item.email, email),
  );
}

export function authSessionMatches(store: CatalogState, email: string, token: string) {
  if (!email || !token) return false;
  const row = findByEmail(store.authSessions, email);
  return row?.token === token;
}

export function emailOwner(
  store: CatalogState,
  email: string,
): "admin" | "instructor" | "student" | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  if (emailsMatch(normalized, adminEmail())) return "admin";
  if (findByEmail(store.instructorAccounts, normalized)) return "instructor";
  if (findByEmail(store.studentAccounts, normalized)) return "student";
  const profile = findByEmail(store.profiles, normalized);
  if (profile?.role === "instructor") return "instructor";
  if (profile?.role === "student") return "student";
  return null;
}

export function assertEmailAvailable(
  store: CatalogState,
  email: string,
  options?: { allowExistingStudentProfile?: boolean },
) {
  const owner = emailOwner(store, email);
  if (!owner) return;
  if (owner === "admin") throw new Error(EMAIL_IN_USE_MESSAGE);
  if (owner === "instructor") {
    throw new Error("هذا البريد مرتبط بحساب مدرّس ولا يمكن استخدامه لحساب آخر.");
  }
  if (owner === "student" && options?.allowExistingStudentProfile) {
    if (findByEmail(store.studentAccounts, email)) throw new Error(EMAIL_IN_USE_MESSAGE);
    if (findByEmail(store.authSessions, email)) throw new Error(EMAIL_IN_USE_MESSAGE);
    const profile = findByEmail(store.profiles, email);
    if (profile?.joinedAt) throw new Error(EMAIL_IN_USE_MESSAGE);
    return;
  }
  throw new Error(EMAIL_IN_USE_MESSAGE);
}
