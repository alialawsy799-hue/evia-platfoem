import type { Profile } from "@/lib/types";
import { emailsMatch, normalizeEmail } from "@/lib/auth/email";

export function studentIdFromEmail(email: string) {
  return `student-${normalizeEmail(email).replace(/[^a-z0-9]/g, "")}`;
}

export function collectUserIds(
  user: Pick<Profile, "id" | "email">,
  profiles: Pick<Profile, "id" | "email">[] = [],
) {
  const email = normalizeEmail(user.email);
  const ids = new Set<string>([user.id]);
  if (email) ids.add(studentIdFromEmail(email));
  for (const profile of profiles) {
    if (profile.id === user.id || emailsMatch(profile.email, email)) {
      ids.add(profile.id);
    }
  }
  return ids;
}

export function isEnrolledAs(
  user: Pick<Profile, "id" | "email">,
  enrolledUserIds: string[],
  profiles: Pick<Profile, "id" | "email">[] = [],
) {
  const ids = collectUserIds(user, profiles);
  return enrolledUserIds.some((id) => ids.has(id));
}

export function safeInternalPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (value.includes("://")) return fallback;
  return value;
}
