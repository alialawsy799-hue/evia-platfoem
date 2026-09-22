"use client";

import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/lib/types";

export function UserMenu({ user }: { user: Profile }) {
  const [imageFailed, setImageFailed] = useState(false);
  const dashboardHref = user.role === "instructor" ? "/instructor#profile" : "/dashboard#profile";
  const initial = (user.fullName.trim().charAt(0) || user.email.charAt(0) || "إ").toUpperCase();

  return (
    <Link
      href={dashboardHref}
      aria-label="حسابي"
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-l from-[#7C5CFF] to-[#9D7BFF] text-sm font-bold text-white shadow-[0_8px_32px_rgba(124,92,255,0.45)] ring-2 ring-white/10 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
    >
      {user.avatarUrl && !imageFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initial
      )}
    </Link>
  );
}
