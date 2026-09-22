import "server-only";

import { revalidatePath } from "next/cache";
import { studentIdFromEmail } from "@/lib/auth/identity";
import { emailsMatch, findByEmail, normalizeEmail } from "@/lib/auth/email";
import { rotateAuthSession } from "@/lib/auth/exclusive-session";
import { readStore, writeStore } from "@/lib/data/store";
import type { Profile } from "@/lib/types";

export async function upsertStudentFromAuth(input: {
  email: string;
  fullName: string;
  avatarUrl?: string;
}): Promise<{ profile: Profile; sid: string }> {
  const email = normalizeEmail(input.email);
  const store = await readStore();
  const instructorAccount = findByEmail(store.instructorAccounts, email);
  const existing = findByEmail(store.profiles, email);
  const instructor = instructorAccount
    ? store.instructors.find((item) => item.id === instructorAccount.instructorId)
    : undefined;

  const profile: Profile = instructor
    ? {
        id: instructor.id,
        email: instructorAccount?.email ?? email,
        fullName: instructor.name,
        avatarUrl: input.avatarUrl || instructor.avatarUrl,
        role: "instructor",
        joinedAt: existing?.joinedAt ?? instructorAccount?.createdAt ?? new Date().toISOString(),
      }
    : {
        id: existing?.id ?? studentIdFromEmail(email),
        email: existing?.email ?? email,
        fullName: input.fullName.trim() || existing?.fullName || email.split("@")[0],
        avatarUrl: input.avatarUrl || existing?.avatarUrl,
        role: "student",
        joinedAt: existing?.joinedAt ?? new Date().toISOString(),
      };

  if (existing) {
    const index = store.profiles.findIndex((item) => emailsMatch(item.email, email));
    store.profiles[index] = {
      ...existing,
      ...profile,
      role: instructor ? "instructor" : existing.role === "instructor" ? "instructor" : "student",
    };
  } else {
    store.profiles.push(profile);
  }

  const sid = rotateAuthSession(store, email);
  await writeStore(store);
  revalidatePath("/admin/students");
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard");
  const saved = findByEmail(store.profiles, email) ?? profile;
  return { profile: saved, sid };
}
