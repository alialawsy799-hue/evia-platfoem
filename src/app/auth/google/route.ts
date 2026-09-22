import { NextResponse } from "next/server";
import {
  createPkce,
  googleAuthorizationUrl,
  isGoogleAuthConfigured,
  oauthCookieOptions,
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  randomUrlSafe,
} from "@/lib/auth/google";
import { safeInternalPath } from "@/lib/auth/identity";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeInternalPath(url.searchParams.get("next"));
  const secure = url.protocol === "https:";

  if (!isGoogleAuthConfigured()) {
    const dest = new URL("/", url.origin);
    dest.searchParams.set("authError", "google_not_configured");
    return NextResponse.redirect(dest);
  }

  const state = randomUrlSafe(16);
  const { verifier, challenge } = createPkce();
  const response = NextResponse.redirect(
    googleAuthorizationUrl({ origin: url.origin, state, challenge }),
  );
  const options = oauthCookieOptions(secure);
  response.cookies.set(OAUTH_STATE_COOKIE, state, options);
  response.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, options);
  response.cookies.set(OAUTH_NEXT_COOKIE, next, options);
  return response;
}
