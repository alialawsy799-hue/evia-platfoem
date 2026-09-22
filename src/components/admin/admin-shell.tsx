"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  TicketPercent,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { EviaLogo } from "@/components/brand/evia-logo";
import { adminLogout } from "@/lib/admin/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ADMIN_TABS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/activations", label: "تفعيل الزبائن", icon: UserPlus },
  { href: "/admin/students", label: "الزبائن", icon: Users },
  { href: "/admin/courses", label: "الكورسات", icon: BookOpen },
  { href: "/admin/instructors", label: "المدرسين", icon: GraduationCap },
  { href: "/admin/instructor-accounts", label: "حساب الأستاذ", icon: KeyRound },
  { href: "/admin/coupons", label: "أكواد الخصم", icon: TicketPercent },
  { href: "/admin/finance", label: "المالية", icon: Wallet },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminTabLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        router.push(href);
        router.refresh();
      }}
    >
      {children}
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = ADMIN_TABS.find((tab) => isActive(pathname, tab.href)) ?? ADMIN_TABS[0];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-s border-white/10 bg-[#0c0a14]/90 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-8 px-2">
          <EviaLogo size="sm" />
          <p className="mt-3 text-xs text-[#9D7BFF]">لوحة خارجية</p>
        </div>
        <LayoutGroup id="admin-nav-desktop">
          <nav className="grid gap-1">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(pathname, tab.href);
              return (
                <AdminTabLink
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active ? "text-white" : "text-slate-300 hover:bg-white/5",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="admin-desktop-pill"
                      className="absolute inset-0 rounded-xl bg-violet-600/25 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <Icon className="relative z-10 size-4" />
                  <span className="relative z-10">{tab.label}</span>
                </AdminTabLink>
              );
            })}
          </nav>
        </LayoutGroup>
        <form action={adminLogout} className="mt-auto pt-6">
          <Button type="submit" variant="ghost" className="w-full">
            خروج الإدارة
          </Button>
        </form>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07060f]/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 lg:hidden">EVIA Admin</p>
              <h2 className="text-lg font-bold">{current.label}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/" target="_blank" rel="noreferrer">
                  عرض الموقع
                </Link>
              </Button>
              <form action={adminLogout} className="lg:hidden">
                <Button type="submit" size="sm" variant="ghost">
                  خروج
                </Button>
              </form>
            </div>
          </div>
          <LayoutGroup id="admin-nav-mobile">
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {ADMIN_TABS.map((tab) => {
                const active = isActive(pathname, tab.href);
                return (
                  <AdminTabLink
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "relative shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-violet-400/50 text-white"
                        : "border-white/10 text-slate-300",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="admin-mobile-pill"
                        className="absolute inset-0 rounded-full bg-violet-500/20"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">{tab.label}</span>
                  </AdminTabLink>
                );
              })}
            </div>
          </LayoutGroup>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
