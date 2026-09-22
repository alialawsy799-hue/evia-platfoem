import { EviaLogo } from "@/components/brand/evia-logo";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl glass p-8 shadow-[0_20px_80px_rgba(124,92,255,0.18)]">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <EviaLogo variant="stacked" size="md" />
          </div>
          <p className="text-sm text-[#9D7BFF]">EVIA Control</p>
          <h1 className="mt-1 text-2xl font-bold">دخول الإدارة الخارجي</h1>
          <p className="mt-2 text-sm text-slate-400">
            هذه الصفحة للإدارة فقط. حساب الأستاذ يُفتح من الصفحة الرئيسية عبر زر تسجيل الدخول.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
