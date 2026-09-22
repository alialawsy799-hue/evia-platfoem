import { NextResponse } from "next/server";
import { readAuthSession } from "@/lib/auth/session";

export async function GET() {
  const user = await readAuthSession();
  return NextResponse.json({ user });
}
