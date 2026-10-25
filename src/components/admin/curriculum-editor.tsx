"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { VideoLinkField } from "@/components/admin/video-link-field";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { replaceModules } from "@/lib/data/actions";
import type { Lesson, Module } from "@/lib/types";
import { formatVideoLink, parseVideoLink } from "@/lib/video";

type LessonDraft = Lesson & { videoUrl: string };

type ModuleDraft = Omit<Module, "lessons"> & { lessons: LessonDraft[] };

function toDraft(modules: Module[]): ModuleDraft[] {
  return modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      videoUrl: formatVideoLink({
        id: lesson.vimeoId,
        hash: lesson.vimeoHash,
        provider: lesson.videoProvider,
      }),
    })),
  }));
}

export function CurriculumEditor({
  courseId,
  modules,
}: {
  courseId: string;
  modules: Module[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => toDraft(modules));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateModule(index: number, patch: Partial<ModuleDraft>) {
    setDraft((current) =>
      current.map((module, i) => (i === index ? { ...module, ...patch } : module)),
    );
  }

  function updateLesson(moduleIndex: number, lessonIndex: number, patch: Partial<LessonDraft>) {
    setDraft((current) =>
      current.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, j) =>
                j === lessonIndex ? { ...lesson, ...patch } : lesson,
              ),
            }
          : module,
      ),
    );
  }

  function addModule() {
    const id = `${courseId}-m-${Date.now()}`;
    setDraft((current) => [
      ...current,
      {
        id,
        title: `الوحدة ${current.length + 1}`,
        order: current.length + 1,
        lessons: [newLesson(courseId, 1)],
      },
    ]);
  }

  function addLesson(moduleIndex: number) {
    setDraft((current) =>
      current.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              lessons: [...module.lessons, newLesson(courseId, module.lessons.length + 1)],
            }
          : module,
      ),
    );
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload: Module[] = draft.map((module, moduleIndex) => ({
        id: module.id,
        title: module.title.trim() || `الوحدة ${moduleIndex + 1}`,
        order: moduleIndex + 1,
        quiz: module.quiz,
        lessons: module.lessons.map((lesson, lessonIndex) => {
          const parsed = parseVideoLink(lesson.videoUrl);
          if (lesson.videoUrl.trim() && !parsed) {
            throw new Error(`رابط فيديو غير صالح في «${lesson.title || "درس بدون عنوان"}»`);
          }
          return {
            id: lesson.id,
            title: lesson.title.trim() || `الدرس ${lessonIndex + 1}`,
            description: lesson.description,
            durationMinutes: Number(lesson.durationMinutes) || 0,
            vimeoId: parsed?.id ?? "",
            vimeoHash: parsed?.hash,
            videoProvider: parsed?.provider,
            order: lessonIndex + 1,
          };
        }),
      }));
      await replaceModules(courseId, payload);
      setMessage("تم حفظ فيديوهات المنهج.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تعذر حفظ المنهج");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl glass p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">فيديوهات الكورس</h3>
          <p className="text-sm text-muted-foreground">
            أضف الوحدات والدروس، ثم الصق رابط كل فيديو من Vimeo أو YouTube.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={addModule}>
          <Plus className="size-4" />
          إضافة وحدة
        </Button>
      </div>

      {draft.length ? (
        <div className="space-y-4">
          {draft.map((module, moduleIndex) => (
            <section key={module.id} className="space-y-3 rounded-2xl border border-border bg-[#0c1018] p-4">
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-60 flex-1 grid gap-2">
                  <Label>عنوان الوحدة</Label>
                  <Input
                    value={module.title}
                    onChange={(event) => updateModule(moduleIndex, { title: event.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setDraft((current) => current.filter((_, i) => i !== moduleIndex))}
                >
                  <Trash2 className="size-4" />
                  حذف الوحدة
                </Button>
              </div>

              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="space-y-3 rounded-xl border border-border bg-muted/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-primary">الدرس {lessonIndex + 1}</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setDraft((current) =>
                          current.map((item, i) =>
                            i === moduleIndex
                              ? { ...item, lessons: item.lessons.filter((_, j) => j !== lessonIndex) }
                              : item,
                          ),
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>عنوان الدرس</Label>
                      <Input
                        value={lesson.title}
                        onChange={(event) =>
                          updateLesson(moduleIndex, lessonIndex, { title: event.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>المدة (دقائق)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={lesson.durationMinutes}
                        onChange={(event) =>
                          updateLesson(moduleIndex, lessonIndex, {
                            durationMinutes: Number(event.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <VideoLinkField
                    label="رابط فيديو الدرس"
                    value={lesson.videoUrl}
                    onChange={(videoUrl) => updateLesson(moduleIndex, lessonIndex, { videoUrl })}
                  />
                  <div className="grid gap-2">
                    <Label>وصف مختصر</Label>
                    <Textarea
                      className="min-h-20"
                      value={lesson.description}
                      onChange={(event) =>
                        updateLesson(moduleIndex, lessonIndex, { description: event.target.value })
                      }
                    />
                  </div>
                </div>
              ))}

              <Button type="button" size="sm" variant="outline" onClick={() => addLesson(moduleIndex)}>
                <Plus className="size-4" />
                إضافة درس
              </Button>
            </section>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          لا توجد وحدات بعد. أضف وحدة ثم الصق روابط الفيديوهات.
        </p>
      )}

      <Button type="button" disabled={busy} onClick={() => void save()}>
        {busy ? "جارٍ الحفظ..." : "حفظ المنهج والفيديوهات"}
      </Button>
      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}

function newLesson(courseId: string, order: number): LessonDraft {
  return {
    id: `${courseId}-l-${Date.now()}-${order}`,
    title: `الدرس ${order}`,
    description: "",
    durationMinutes: 10,
    vimeoId: "",
    order,
    videoUrl: "",
  };
}
