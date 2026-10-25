"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, Clock, SlidersHorizontal, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnrollModal } from "@/components/course/enroll-modal";
import { PriceDisplay } from "@/components/course/price-display";
import { CATEGORY_LABELS, COURSE_CATEGORIES, isCourseCategory } from "@/lib/categories";
import type { Course, CourseCategory, Instructor } from "@/lib/types";
import { getCourseDurationMinutes, isComingSoon } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

export function CourseCard({
  course,
  instructor,
}: {
  course: Course;
  instructor?: Instructor;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_40px_rgba(130,80,161,0.12)]">
        <Link href={`/courses/${course.id}`} className="block overflow-hidden">
          <div className="relative aspect-[8/5]">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <Badge className="absolute right-3 top-3" variant="glow">
              {CATEGORY_LABELS[course.category]}
            </Badge>
            {isComingSoon(course) ? (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-extrabold tracking-[0.18em] text-white">
                SOON
              </span>
            ) : null}
          </div>
        </Link>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-lg font-bold">{course.title}</h3>
            {instructor ? <p className="text-sm text-muted-foreground">{instructor.name}</p> : null}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {course.rating.toFixed(1)}/5
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4 text-primary" />
              {formatDuration(getCourseDurationMinutes(course))}
            </span>
          </div>
          {isComingSoon(course) ? null : <PriceDisplay course={course} size="sm" />}
          <div className={cn("grid gap-2", isComingSoon(course) ? "grid-cols-1" : "grid-cols-2")}>
            <Button asChild variant="dark" size="sm">
              <Link href={`/courses/${course.id}`}>التفاصيل</Link>
            </Button>
            {isComingSoon(course) ? null : (
              <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                اشترك الآن
              </Button>
            )}
          </div>
        </div>
      </article>
      <EnrollModal open={open} onOpenChange={setOpen} course={course} />
    </>
  );
}

function FilterMenu({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button type="button" variant="outline" size="sm" className="min-w-44 justify-between">
          <span className="inline-flex items-center gap-2">
            {icon}
            {label}
          </span>
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 max-h-80 min-w-56 overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-[0_16px_50px_rgba(99,102,241,0.28)]"
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.id}
              onSelect={() => onChange(option.id)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none",
                value === option.id
                  ? "bg-muted text-primary"
                  : "text-muted-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
              )}
            >
              {option.label}
              {value === option.id ? <Check className="size-4 text-primary" /> : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function CourseGrid({
  courses,
  instructors,
  initialCategory = "all",
  heading = "كورسات مختارة لك",
}: {
  courses: Course[];
  instructors: Instructor[];
  initialCategory?: CourseCategory | "all";
  heading?: string;
}) {
  const [category, setCategory] = useState<CourseCategory | "all">(
    isCourseCategory(initialCategory) ? initialCategory : "all",
  );
  const [instructorId, setInstructorId] = useState("all");
  const instructorOptions = useMemo(
    () => [
      { id: "all", label: "كل المدرسين" },
      ...instructors.map((instructor) => ({ id: instructor.id, label: instructor.name })),
    ],
    [instructors],
  );
  const filtered = useMemo(
    () =>
      courses.filter((course) => {
        const matchesCategory = category === "all" || course.category === category;
        const matchesInstructor = instructorId === "all" || course.instructorId === instructorId;
        return matchesCategory && matchesInstructor;
      }),
    [category, courses, instructorId],
  );

  return (
    <section id="courses" className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-primary">المكتبة</p>
          <h2 className="text-3xl font-black">{heading}</h2>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/courses">كل التصنيفات</Link>
        </Button>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterMenu
          label="فرز الكورسات"
          icon={<SlidersHorizontal className="size-4 text-primary" />}
          value={category}
          options={COURSE_CATEGORIES.map((item) => ({ id: item.id, label: item.label }))}
          onChange={(next) => setCategory(next as CourseCategory | "all")}
        />
        {instructors.length > 0 ? (
          <FilterMenu
            label="فرز حسب المدرس"
            icon={<Users className="size-4 text-primary" />}
            value={instructorId}
            options={instructorOptions}
            onChange={setInstructorId}
          />
        ) : null}
      </div>
      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructor={instructors.find((item) => item.id === course.instructorId)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl glass p-8 text-center text-muted-foreground">
          لا توجد كورسات مطابقة لهذا الفرز حالياً.
        </p>
      )}
    </section>
  );
}
