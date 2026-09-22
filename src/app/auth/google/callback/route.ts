import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  fetchGoogleUser,
  oauthCookieOptions,
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  safeEqual,
} from "@/lib/auth/google";
import { safeInternalPath } from "@/lib/auth/identity";
import { attachAuthCookie } from "@/lib/auth/session";
import { upsertStudentFromAuth } from "@/lib/auth/upsert-student";

function clearOauthCookies(response: NextResponse, secure: boolean) {
  const options = { ...oauthCookieOptions(secure), maxAge: 0 };
  response.cookies.set(OAUTH_STATE_COOKIE, "", options);
  response.cookies.set(OAUTH_VERIFIER_COOKIE, "", options);
  response.cookies.set(OAUTH_NEXT_COOKIE, "", options);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secure = url.protocol === "https:";

  const fail = (code: string) => {
    const dest = new URL("/", url.origin);
    dest.searchParams.set("authError", code);
    const response = NextResponse.redirect(dest);
    clearOauthCookies(response, secure);
    return response;
  };

  const providerError = url.searchParams.get("error");
  if (providerError === "access_denied") return fail("google_denied");
  if (providerError) return fail("google_failed");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const verifier = cookieStore.get(OAUTH_VERIFIER_COOKIE)?.value;
  const next = safeInternalPath(cookieStore.get(OAUTH_NEXT_COOKIE)?.value);

  if (!code || !state || !expectedState || !verifier || !safeEqual(state, expectedState)) {
    return fail("google_failed");
  }

  try {
    const accessToken = await exchangeGoogleCode({
      code,
      verifier,
      origin: url.origin,
    });
    const info = await fetchGoogleUser(accessToken);
    if (!info.email || info.email_verified === false) return fail("missing_email");

    const { profile, sid } = await upsertStudentFromAuth({
      email: info.email,
      fullName: info.name || info.email.split("@")[0],
      avatarUrl: info.picture,
    });

    const destination =
      profile.role === "instructor" && (next === "/dashboard" || next === "/")
        ? "/instructor"
        : next;
    const response = NextResponse.redirect(new URL(destination, url.origin));
    attachAuthCookie(response, profile, secure, sid);
    clearOauthCookies(response, secure);
    return response;
  } catch {
    return fail("google_failed");
  }
}
