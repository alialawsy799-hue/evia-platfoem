import { CreateInstructorDialog } from "@/components/admin/create-instructor-dialog";
import { DeleteInstructorButton } from "@/components/admin/delete-instructor-button";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
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
        <p className="text-sm text-slate-400">ملفات المدرّبين وعدد الكورسات المرتبطة بكل مدرّب.</p>
        <CreateInstructorDialog />
      </div>
      {store.instructors.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#121824] p-6 text-slate-400">
          لا يوجد مدرسون. أضف مدرّساً جديداً من الزر أعلاه.
        </p>
      ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {store.instructors.map((instructor) => {
          const taught = store.courses.filter((course) => course.instructorId === instructor.id);
          return (
            <article
              key={instructor.id}
              className="rounded-2xl border border-white/10 bg-[#121824] p-5"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={instructor.avatarUrl}
                  alt={instructor.name}
                  width={64}
                  height={64}
                  className="size-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{instructor.name}</h3>
                  <p className="text-sm text-violet-300">{instructor.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{instructor.bio}</p>
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
    <div className="rounded-xl bg-white/5 p-3">
      <p className="font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
