"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const TAB_ORDER = ["/", "/dashboard", "/courses", "/instructors", "/paths", "/community"];

let lastPath = "/";

function tabIndex(pathname: string) {
  if (pathname === "/") return 0;
  const index = TAB_ORDER.findIndex(
    (href) => href !== "/" && (pathname === href || pathname.startsWith(`${href}/`)),
  );
  return index === -1 ? 0 : index;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const from = lastPath;
  lastPath = pathname;
  const direction = tabIndex(pathname) >= tabIndex(from) ? 1 : -1;

  return (
    <motion.div
      key={pathname}
      className="overflow-x-clip"
      initial={reduceMotion ? false : { opacity: 0, x: direction * -32, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
