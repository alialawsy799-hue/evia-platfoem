"use client";

import { Lock } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Course } from "@/lib/types";

export function Curriculum({
  course,
  locked,
  onLockedClick,
}: {
  course: Course;
  locked: boolean;
  onLockedClick?: () => void;
}) {
  return (
    <div className="space-y-4">
      {course.modules.map((module) => (
        <section key={module.id} className="rounded-2xl border border-white/10 bg-[#121824]/80 p-4">
          <h3 className="mb-3 font-bold">{module.title}</h3>
          <ul className="space-y-2">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => locked && onLockedClick?.()}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-right transition hover:border-violet-400/30"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    {locked ? <Lock className="size-4 text-violet-300" /> : null}
                    {formatDuration(lesson.durationMinutes)}
                  </span>
                  <span>
                    <span className="block font-medium">{lesson.title}</span>
                    <span className="block text-xs text-slate-500">{lesson.description}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
