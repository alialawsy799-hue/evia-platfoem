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
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white shadow-[0_8px_24px_rgba(130,80,161,0.28)] ring-2 ring-primary/15 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
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
