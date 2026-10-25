import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

const POSTS = [
  {
    name: "ليان",
    time: "قبل ساعتين",
    body: "هل يوجد تمرين إضافي على RTL مع Grid؟",
  },
  {
    name: "فهد",
    time: "قبل 5 ساعات",
    body: "أنهيت وحدة الحماية وأحتاج مراجعة قبل الاختبار.",
  },
];

export default function CommunityPage() {
  return (
    <div>
      <main className="mx-auto grid w-[min(1100px,calc(100%-1.5rem))] gap-6 py-10 lg:grid-cols-[1fr_280px]">
        <div>
          <input
            placeholder="ابحث في النقاشات"
            className="mb-5 h-11 w-full rounded-full border border-border bg-muted/60 px-5 text-sm"
          />
          <div className="space-y-4">
            {POSTS.map((post) => (
              <Card key={post.body} className="p-5">
                <p className="text-sm font-bold">{post.name}</p>
                <p className="text-xs text-muted-foreground">{post.time}</p>
                <p className="mt-3 text-foreground">{post.body}</p>
                <p className="mt-4 text-xs text-muted-foreground">إعجاب · تعليق · مشاركة</p>
              </Card>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl glass p-4">
          <h2 className="mb-3 font-bold">مجموعات نشطة</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>مجموعة تطوير الويب</li>
            <li>مختبر الذكاء الاصطناعي</li>
            <li>حماية المحتوى</li>
          </ul>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
