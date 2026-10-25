"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EviaLogo } from "@/components/brand/evia-logo";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/layout/user-menu";
import { authErrorMessage } from "@/lib/auth/messages";
import { INSTRUCTOR_NAV, NAV_LINKS, STUDENT_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isLinkActive(pathname: string, href: string, hash: string) {
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hash, setHash] = useState("");
  const [authError, setAuthError] = useState("");
  const links =
    user?.role === "student" ? STUDENT_NAV : user?.role === "instructor" ? INSTRUCTOR_NAV : NAV_LINKS;
  const homeHref = user?.role === "instructor" ? "/instructor" : user ? "/dashboard" : "/";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("authError");
    if (!code) return;
    setAuthError(authErrorMessage(code));
    setOpen(true);
    params.delete("authError");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  function onNavClick(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (!href.startsWith("/#")) return;
    if (pathname !== "/") return;
    event.preventDefault();
    const id = href.slice(2);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", href);
    setHash(`#${id}`);
    setMenu(false);
  }

  return (
    <>
      <header className="sticky top-4 z-40 mx-auto w-[min(1120px,calc(100%-1.5rem))]">
        <nav
          className={cn(
            "glass flex items-center justify-between gap-3 rounded-full px-3 py-2 shadow-[0_10px_30px_rgba(130,80,161,0.08)]",
            transparent && "bg-white/80",
          )}
        >
          <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                <Button size="sm" variant="ghost" onClick={() => signOut()}>
                  خروج
                </Button>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Button size="sm" className="hidden sm:inline-flex" onClick={() => setOpen(true)}>
                  ابدأ التعلم الآن
                </Button>
                <Button size="sm" variant="outline" className="max-sm:px-2.5 max-sm:text-xs" onClick={() => setOpen(true)}>
                  تسجيل الدخول
                </Button>
              </>
            )}
            <button
              className="rounded-full p-2 text-foreground transition hover:bg-muted md:hidden"
              onClick={() => setMenu((value) => !value)}
              aria-label={menu ? "إغلاق القائمة" : "القائمة"}
              aria-expanded={menu}
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <LayoutGroup id="site-nav">
            <div className="hidden items-center gap-1 text-sm md:flex">
              {links.map((link) => {
                const active = isLinkActive(pathname, link.href, hash);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => onNavClick(link.href, event)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 transition-colors duration-200",
                      active ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="site-nav-pill"
                        className="absolute inset-0 rounded-full bg-muted ring-1 ring-primary/20"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>

          <Link href={homeHref} className="shrink-0 px-1" aria-label="إيفيا">
            <EviaLogo size="sm" />
          </Link>
        </nav>
        <AnimatePresence>
          {menu ? (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 origin-top rounded-2xl glass p-2 md:hidden"
            >
              {links.map((link, index) => {
                const active = isLinkActive(pathname, link.href, hash);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.22 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        onNavClick(link.href, event);
                        setMenu(false);
                      }}
                      className={cn(
                        "block rounded-xl px-4 py-2.5 text-sm transition",
                        active
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              {!user ? (
                <Button className="mt-2 w-full" onClick={() => { setMenu(false); setOpen(true); }}>
                  ابدأ التعلم الآن
                </Button>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <AuthModal
        open={open}
        initialError={authError}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setAuthError("");
        }}
      />
    </>
  );
}
