import { SiteFooter } from "@/components/layout/site-footer";

export default function PathsPage() {
  return (
    <div>
      <main className="mx-auto w-[min(800px,calc(100%-1.5rem))] py-16">
        <h1 className="text-3xl font-black">مسارات التعلم</h1>
        <p className="mt-3 text-muted-foreground">
          مسارات متدرجة تجمع عدة كورسات: واجهات، بيانات، وأمن دفاعي — قريباً بترتيب ذكي حسب هدفك.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
