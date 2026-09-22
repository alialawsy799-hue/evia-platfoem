import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;
const SCRYPT = { N: 16384, r: 8, p: 1 } as const;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN, SCRYPT).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function needsPasswordRehash(stored: string) {
  return !stored.startsWith("scrypt:");
}

export function passwordMatches(stored: string, input: string) {
  if (!stored || !input) return false;

  if (stored.startsWith("scrypt:")) {
    const parts = stored.split(":");
    if (parts.length !== 3) return false;
    const digest = scryptSync(input, parts[1], KEYLEN, SCRYPT);
    const expected = Buffer.from(parts[2], "hex");
    if (expected.length !== digest.length) return false;
    return timingSafeEqual(expected, digest);
  }

  const sha = createHash("sha256").update(`evia:${input}`).digest("hex");
  if (stored.length === sha.length) {
    try {
      if (timingSafeEqual(Buffer.from(stored), Buffer.from(sha))) return true;
    } catch {
      return false;
    }
  }

  const left = Buffer.from(stored);
  const right = Buffer.from(input);
  return left.length === right.length && timingSafeEqual(left, right);
}
