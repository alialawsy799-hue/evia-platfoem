import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export const OAUTH_STATE_COOKIE = "evia_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "evia_oauth_verifier";
export const OAUTH_NEXT_COOKIE = "evia_oauth_next";

export type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function randomUrlSafe(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function createPkce() {
  const verifier = randomUrlSafe(32);
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function googleRedirectUri(origin: string) {
  return `${origin.replace(/\/$/, "")}/auth/google/callback`;
}

export function googleAuthorizationUrl(input: {
  origin: string;
  state: string;
  challenge: string;
}) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: googleRedirectUri(input.origin),
    response_type: "code",
    scope: "openid email profile",
    state: input.state,
    code_challenge: input.challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
    access_type: "online",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function oauthCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
    secure,
  };
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function exchangeGoogleCode(input: {
  code: string;
  verifier: string;
  origin: string;
}) {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      code: input.code,
      grant_type: "authorization_code",
      redirect_uri: googleRedirectUri(input.origin),
      code_verifier: input.verifier,
    }),
  });

  if (!response.ok) {
    throw new Error("google_token_failed");
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("google_token_failed");
  return data.access_token;
}

export async function fetchGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("google_userinfo_failed");
  return (await response.json()) as GoogleUserInfo;
}
