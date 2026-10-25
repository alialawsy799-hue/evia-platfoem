"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const TAB_ORDER = [
  "/admin",
  "/admin/activations",
  "/admin/students",
  "/admin/courses",
  "/admin/instructors",
  "/admin/coupons",
  "/admin/ugc-coupons",
  "/admin/finance",
];

let lastPath = "/admin";

function tabIndex(pathname: string) {
  if (pathname === "/admin") return 0;
  const index = TAB_ORDER.findIndex(
    (href) => href !== "/admin" && (pathname === href || pathname.startsWith(`${href}/`)),
  );
  return index === -1 ? 0 : index;
}

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const from = lastPath;
  lastPath = pathname;
  const direction = tabIndex(pathname) >= tabIndex(from) ? 1 : -1;

  return (
    <motion.div
      key={pathname}
      className="overflow-x-clip"
      initial={reduceMotion ? false : { opacity: 0, x: direction * -24, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
