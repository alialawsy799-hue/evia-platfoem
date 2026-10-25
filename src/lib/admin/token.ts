import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.EVIA_AUTH_SECRET || process.env.EVIA_ADMIN_COOKIE;
  if (value && value !== "change-me-in-production" && value !== "evia-admin-gate") {
    return value;
  }
  return "evia-dev-admin-secret";
}

export function signAdminToken() {
  const key = secret();
  if (!key) throw new Error("أضف EVIA_AUTH_SECRET في إعدادات الخادم");
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000, n: randomBytes(16).toString("hex") }),
    "utf8",
  );
  const signature = createHmac("sha256", key).update(payload).digest("base64url");
  return `${payload.toString("base64url")}.${signature}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token || !token.includes(".")) return false;
  const key = secret();
  if (!key) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  try {
    const payload = Buffer.from(encoded, "base64url");
    const expected = createHmac("sha256", key).update(payload).digest("base64url");
    const left = Buffer.from(signature);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
    const data = JSON.parse(payload.toString("utf8")) as { exp?: number };
    return Boolean(data.exp && data.exp > Date.now());
  } catch {
    return false;
  }
}

export function adminCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure,
  };
}

export { ADMIN_COOKIE };
