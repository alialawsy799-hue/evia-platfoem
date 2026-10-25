import { CreateInstructorDialog } from "@/components/admin/create-instructor-dialog";
import { DeleteInstructorButton } from "@/components/admin/delete-instructor-button";
import { unstable_noStore as noStore } from "next/cache";
import { InstructorAvatar } from "@/components/instructor/instructor-avatar";
import { readStore } from "@/lib/data/store";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInstructorsPage() {
  noStore();
  const store = await readStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">ملفات المدرّبين وعدد الكورسات المرتبطة بكل مدرّب.</p>
        <CreateInstructorDialog />
      </div>
      {store.instructors.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          لا يوجد مدرسون. أضف مدرّساً جديداً من الزر أعلاه.
        </p>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {store.instructors.map((instructor) => {
          const taught = store.courses.filter((course) => course.instructorId === instructor.id);
          return (
            <article
              key={instructor.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-4">
                <InstructorAvatar
                  name={instructor.name}
                  src={instructor.avatarUrl}
                  size={64}
                  className="size-16"
                />
                <div>
                  <h3 className="font-bold">{instructor.name}</h3>
                  <p className="text-sm text-primary">{instructor.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{instructor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.specialties.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <Stat label="خبرة" value={`${formatNumber(instructor.yearsExperience)} سنة`} />
                <Stat label="كورسات" value={formatNumber(taught.length)} />
                <Stat label="معلّق" value={formatPrice(instructor.pendingBalance)} />
              </div>
              <DeleteInstructorButton
                instructorId={instructor.id}
                name={instructor.name}
                className="mt-4 w-full"
              />
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <p className="font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
