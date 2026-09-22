import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <>
      <NavigationProgress />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
