import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { authSessionMatches } from "@/lib/auth/exclusive-session";
import { readStore } from "@/lib/data/store";
import type { Profile } from "@/lib/types";

export const AUTH_COOKIE = "evia_user";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = Profile & { exp: number; sid: string };
type VerifiedSession = Profile & { sid: string };

function secret() {
  const value = process.env.EVIA_AUTH_SECRET;
  if (value && value !== "change-me-in-production") return value;
  if (process.env.NODE_ENV === "production") return "";
  return "evia-dev-auth-secret";
}

export function authCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure,
  };
}

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

export function signSession(profile: Profile, sid: string) {
  const key = secret();
  if (!key) throw new Error("EVIA_AUTH_SECRET is required");
  const payload = Buffer.from(
    JSON.stringify({
      ...publicProfile(profile),
      sid,
      exp: Date.now() + MAX_AGE_SECONDS * 1000,
    } satisfies SessionPayload),
    "utf8",
  );
  const signature = createHmac("sha256", key).update(payload).digest();
  return `${payload.toString("base64url")}.${signature.toString("base64url")}`;
}

export function verifySession(token: string): VerifiedSession | null {
  const key = secret();
  if (!key) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const payload = Buffer.from(encoded, "base64url");
  const expected = createHmac("sha256", key).update(payload).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const data = JSON.parse(payload.toString("utf8")) as SessionPayload;
    if (!data.exp || data.exp < Date.now() || !data.sid) return null;
    if (!data.id || !data.email || data.role === "admin") return null;
    return {
      ...publicProfile(data),
      sid: data.sid,
    };
  } catch {
    return null;
  }
}

export function attachAuthCookie(
  response: NextResponse,
  profile: Profile,
  secure: boolean,
  sid: string,
) {
  response.cookies.set(AUTH_COOKIE, signSession(profile, sid), authCookieOptions(secure));
}

export function clearAuthCookie(response: NextResponse, secure = false) {
  response.cookies.set(AUTH_COOKIE, "", { ...authCookieOptions(secure), maxAge: 0 });
}

export async function writeAuthCookie(profile: Profile, sid: string, secure = false) {
  (await cookies()).set(AUTH_COOKIE, signSession(profile, sid), authCookieOptions(secure));
}

export async function readAuthSession(): Promise<Profile | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session) return null;
  const store = await readStore();
  if (!authSessionMatches(store, session.email, session.sid)) return null;
  return publicProfile(session);
}
