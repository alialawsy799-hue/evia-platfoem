import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <div>
      <SiteHeader />
      <main className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-3xl font-black">الصفحة غير موجودة</h1>
          <Link href="/" className="mt-4 inline-block text-violet-300">
            العودة لإيفيا
          </Link>
        </div>
      </main>
    </div>
  );
}
