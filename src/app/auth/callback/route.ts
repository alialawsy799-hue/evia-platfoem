import { NextResponse } from "next/server";
import { safeInternalPath } from "@/lib/auth/identity";
import { attachAuthCookie } from "@/lib/auth/session";
import { upsertStudentFromAuth } from "@/lib/auth/upsert-student";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeInternalPath(url.searchParams.get("next"));
  const supabase = await createSupabaseServer();

  if (url.searchParams.get("error")) {
    const dest = new URL("/", url.origin);
    dest.searchParams.set("authError", "google_failed");
    return NextResponse.redirect(dest);
  }

  if (code && supabase) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user?.email) {
      const dest = new URL("/", url.origin);
      dest.searchParams.set("authError", "google_failed");
      return NextResponse.redirect(dest);
    }

    const metadata = data.user.user_metadata ?? {};
    const { profile, sid } = await upsertStudentFromAuth({
      email: data.user.email,
      fullName:
        (metadata.full_name as string) ||
        (metadata.name as string) ||
        data.user.email.split("@")[0],
      avatarUrl: (metadata.avatar_url as string) || (metadata.picture as string),
    });

    const destination =
      profile.role === "instructor" && (next === "/dashboard" || next === "/")
        ? "/instructor"
        : next;
    const response = NextResponse.redirect(new URL(destination, url.origin));
    attachAuthCookie(response, profile, url.protocol === "https:", sid);
    return response;
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
