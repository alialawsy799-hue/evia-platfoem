import { NextResponse } from "next/server";
import { loginWithPassword, registerStudent } from "@/lib/auth/actions";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      fullName?: string;
      mode?: "login" | "signup";
    };
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");
    const user =
      body.mode === "signup"
        ? await registerStudent(email, password, body.fullName)
        : await loginWithPassword(email, password);
    return NextResponse.json({ user });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "تعذر تسجيل الدخول";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
