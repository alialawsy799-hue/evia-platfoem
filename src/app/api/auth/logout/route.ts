import { NextResponse } from "next/server";
import { logoutCurrentSession } from "@/lib/auth/actions";
import { clearAuthCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const url = new URL(request.url);
  await logoutCurrentSession();
  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response, url.protocol === "https:");
  return response;
}
