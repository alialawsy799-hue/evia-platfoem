"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, ChevronRight, Lock, PanelRightClose, PanelRightOpen } from "lucide-react";
import { ProtectedVimeoPlayer } from "@/components/player/protected-vimeo-player";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/auth-provider";
import { markLessonComplete, saveQuizAttempt } from "@/lib/data/actions";
import { certificateWhatsappHref } from "@/lib/whatsapp";
import { formatDuration, formatNumber } from "@/lib/utils";
import type { Course, Lesson, Quiz } from "@/lib/types";
import { getLessonCount } from "@/lib/types";
import { cn } from "@/lib/utils";

type LearnerState = {
  completedLessonIds: string[];
  passedQuizIds: string[];
};

export function LearnStudio({
  course,
  enrolled,
  completedLessonIds,
  passedQuizIds,
}: {
  course: Course;
  enrolled: boolean;
  completedLessonIds: string[];
  passedQuizIds: string[];
}) {
  const { user } = useAuth();
  const [sidebar, setSidebar] = useState(true);
  const [state, setState] = useState<LearnerState>({
    completedLessonIds,
    passedQuizIds,
  });
  const lessons = useMemo(
    () => course.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module }))),
    [course],
  );
  const [activeId, setActiveId] = useState(lessons[0]?.lesson.id);
  const [quizMode, setQuizMode] = useState<Quiz | null>(null);
  const [, startTransition] = useTransition();

  const active = lessons.find((item) => item.lesson.id === activeId)?.lesson;
  const total = getLessonCount(course);
  const completed = state.completedLessonIds.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const quizzes = course.modules.map((module) => module.quiz).filter(Boolean) as Quiz[];
  const allQuizzesPassed = quizzes.every((quiz) => state.passedQuizIds.includes(quiz.id));
  const finished = percent === 100 && allQuizzesPassed;

  function completeLesson(lesson: Lesson) {
    if (!user) return;
    setState((current) => ({
      ...current,
      completedLessonIds: Array.from(new Set([...current.completedLessonIds, lesson.id])),
    }));
    startTransition(() => {
      void markLessonComplete(lesson.id);
    });
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-muted-foreground">سجّل الدخول لمتابعة الكورس.</p>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <Lock className="mx-auto mb-3 size-8 text-primary" />
          <h1 className="text-2xl font-bold">هذا الكورس مقفل</h1>
          <Button asChild className="mt-4">
            <Link href={`/courses/${course.id}`}>العودة لصفحة الكورس</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSidebar((value) => !value)}>
            {sidebar ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">السابق</Link>
          </Button>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold">{course.title}</p>
          <p className="text-xs text-muted-foreground">{formatNumber(percent)}% مكتمل</p>
        </div>
        <div className="w-28">
          <Progress value={percent} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px]">
        <main className="p-4 lg:p-6">
          {quizMode ? (
            <QuizPanel
              quiz={quizMode}
              onClose={() => setQuizMode(null)}
              onResult={(score, passed) => {
                if (passed) {
                  setState((current) => ({
                    ...current,
                    passedQuizIds: Array.from(new Set([...current.passedQuizIds, quizMode.id])),
                  }));
                }
              }}
              onSubmit={async (answers) => saveQuizAttempt(quizMode.id, answers)}
            />
          ) : active ? (
            <>
              <ProtectedVimeoPlayer
                videoId={active.vimeoId}
                hash={active.vimeoHash}
                provider={active.videoProvider}
                mode="protected"
                student={{ id: user.id, email: user.email }}
                onEnded={() => completeLesson(active)}
              />
              <section className="mt-5 rounded-2xl glass p-5">
                <h1 className="text-xl font-bold">{active.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{active.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => completeLesson(active)}>
                    تعليم الدرس كمكتمل
                  </Button>
                  <Button asChild variant="dark">
                    <Link href={`/courses/${course.id}`}>وصف الكورس</Link>
                  </Button>
                </div>
              </section>
            </>
          ) : null}

          {finished ? (
            <div className="mt-6 rounded-2xl border border-primary/25 bg-muted p-5">
              <h2 className="text-lg font-bold">أحسنت، أكملت المسار</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                تواصل مع الدعم عبر واتساب لاستلام شهادتك الرسمية.
              </p>
              <Button asChild className="mt-4">
                <a
                  href={certificateWhatsappHref({
                    name: user.fullName,
                    email: user.email,
                    courseTitle: course.title,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  تواصل مع الدعم على واتساب لاستلام شهادتك الرسمية
                </a>
              </Button>
            </div>
          ) : null}
        </main>

        {sidebar ? (
          <aside className="border-s border-border bg-card p-4 backdrop-blur-xl">
            {course.modules.map((module) => (
              <div key={module.id} className="mb-5">
                <p className="mb-2 text-xs text-muted-foreground">{module.title}</p>
                <ul className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const done = state.completedLessonIds.includes(lesson.id);
                    const current = lesson.id === activeId;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => {
                            setQuizMode(null);
                            setActiveId(lesson.id);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-sm",
                            current
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(lesson.durationMinutes)}
                          </span>
                          <span className="flex items-center gap-2">
                            {done ? (
                              <CheckCircle2 className="size-4 text-primary" />
                            ) : (
                              <ChevronRight className="size-4 text-muted-foreground" />
                            )}
                            {lesson.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {module.quiz ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setQuizMode(module.quiz ?? null)}
                  >
                    {state.passedQuizIds.includes(module.quiz.id)
                      ? "إعادة الاختبار"
                      : "اختبار الوحدة"}
                  </Button>
                ) : null}
              </div>
            ))}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function QuizPanel({
  quiz,
  onClose,
  onResult,
  onSubmit,
}: {
  quiz: Quiz;
  onClose: () => void;
  onResult: (score: number, passed: boolean) => void;
  onSubmit: (answers: Record<string, number>) => Promise<{ score: number; passed: boolean }>;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const scored = await onSubmit(answers);
      setResult(scored);
      onResult(scored.score, scored.passed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl glass p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <Button variant="ghost" onClick={onClose}>
          إغلاق
        </Button>
      </div>
      <div className="space-y-5">
        {quiz.questions.map((question) => (
          <fieldset key={question.id}>
            <legend className="mb-2 font-medium">{question.question}</legend>
            <div className="grid gap-2">
              {question.options.map((option, index) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === index}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <Button className="mt-6" onClick={() => void submit()} disabled={busy}>
        {busy ? "جارٍ التصحيح..." : "تصحيح فوري"}
      </Button>
      {result ? (
        <p className={cn("mt-4 font-bold", result.passed ? "text-emerald-300" : "text-rose-300")}>
          {result.passed ? "نجحت" : "لم تحقق درجة النجاح"} — {formatNumber(result.score)}%
        </p>
      ) : null}
    </div>
  );
}
