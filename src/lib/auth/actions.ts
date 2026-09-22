"use server";

import { cookies, headers } from "next/headers";
import { studentIdFromEmail } from "@/lib/auth/identity";
import { emailsMatch, findByEmail, normalizeEmail } from "@/lib/auth/email";
import {
  EMAIL_IN_USE_MESSAGE,
  assertEmailAvailable,
  clearAuthSession,
  rotateAuthSession,
} from "@/lib/auth/exclusive-session";
import { hashPassword, needsPasswordRehash, passwordMatches } from "@/lib/auth/passwords";
import { assertRateLimit } from "@/lib/auth/rate-limit";
import { AUTH_COOKIE, authCookieOptions, readAuthSession, signSession } from "@/lib/auth/session";
import { readStore, writeStore } from "@/lib/data/store";
import type { Profile } from "@/lib/types";

function publicProfile(profile: Profile): Profile {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    joinedAt: profile.joinedAt,
  };
}

async function cookieSecure() {
  const proto = (await headers()).get("x-forwarded-proto");
  return proto === "https" || process.env.NODE_ENV === "production";
}

async function issueSession(profile: Profile, sid: string) {
  (await cookies()).set(
    AUTH_COOKIE,
    signSession(profile, sid),
    authCookieOptions(await cookieSecure()),
  );
  return publicProfile(profile);
}

export async function loginWithPassword(emailRaw: string, password: string): Promise<Profile> {
  const email = normalizeEmail(emailRaw);
  if (!email || !password) throw new Error("أدخل البريد وكلمة المرور");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  assertRateLimit(`login:${ip}:${email}`);

  const store = await readStore();
  const instructorAccount = findByEmail(store.instructorAccounts, email);
  if (instructorAccount) {
    if (!passwordMatches(instructorAccount.password ?? "", password)) {
      throw new Error("البريد أو كلمة المرور غير صحيحة");
    }
    if (needsPasswordRehash(instructorAccount.password ?? "")) {
      instructorAccount.password = hashPassword(password);
    }
    const instructor = store.instructors.find((item) => item.id === instructorAccount.instructorId);
    if (!instructor) throw new Error("حساب المدرّس غير مكتمل");
    const profile: Profile = {
      id: instructor.id,
      email: instructorAccount.email,
      fullName: instructor.name,
      avatarUrl: instructor.avatarUrl,
      role: "instructor",
      joinedAt: instructorAccount.createdAt,
    };
    const sid = rotateAuthSession(store, email);
    await writeStore(store);
    return issueSession(profile, sid);
  }

  const studentAccount = findByEmail(store.studentAccounts, email);
  if (!studentAccount || !passwordMatches(studentAccount.password, password)) {
    throw new Error("البريد أو كلمة المرور غير صحيحة");
  }
  if (needsPasswordRehash(studentAccount.password)) {
    studentAccount.password = hashPassword(password);
  }

  const existing = findByEmail(store.profiles, email);
  const profile: Profile = {
    id: existing?.id ?? studentIdFromEmail(email),
    email: existing?.email ?? email,
    fullName: existing?.fullName || email.split("@")[0],
    avatarUrl: existing?.avatarUrl,
    role: "student",
    joinedAt: existing?.joinedAt ?? studentAccount.createdAt,
  };
  const sid = rotateAuthSession(store, email);
  await writeStore(store);
  return issueSession(profile, sid);
}

export async function registerStudent(
  emailRaw: string,
  password: string,
  fullName?: string,
): Promise<Profile> {
  const email = normalizeEmail(emailRaw);
  if (!email || !password) throw new Error("أدخل البريد وكلمة المرور");
  if (password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  assertRateLimit(`signup:${ip}`, 6);

  const store = await readStore();
  assertEmailAvailable(store, email, { allowExistingStudentProfile: true });

  const existing = findByEmail(store.profiles, email);
  if (existing?.role === "instructor") throw new Error(EMAIL_IN_USE_MESSAGE);

  const createdAt = new Date().toISOString();
  const profile: Profile = {
    id: existing?.id ?? studentIdFromEmail(email),
    email,
    fullName: fullName?.trim() || existing?.fullName || email.split("@")[0],
    avatarUrl: existing?.avatarUrl,
    role: "student",
    joinedAt: existing?.joinedAt ?? createdAt,
  };

  if (existing) {
    const index = store.profiles.findIndex((item) => emailsMatch(item.email, email));
    store.profiles[index] = { ...existing, ...profile };
  } else {
    store.profiles.push(profile);
  }

  store.studentAccounts = [
    ...(store.studentAccounts ?? []).filter((item) => !emailsMatch(item.email, email)),
    { email, password: hashPassword(password), createdAt },
  ];
  const sid = rotateAuthSession(store, email);
  await writeStore(store);
  return issueSession(profile, sid);
}

export async function logoutCurrentSession() {
  const session = await readAuthSession();
  const store = await readStore();
  if (session) {
    clearAuthSession(store, session.email);
    await writeStore(store);
  }
  (await cookies()).set(AUTH_COOKIE, "", {
    ...authCookieOptions(await cookieSecure()),
    maxAge: 0,
  });
}
