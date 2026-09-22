import { EviaLogo } from "@/components/brand/evia-logo";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col items-center gap-3 text-center">
        <EviaLogo size="sm" />
        <p className="text-sm text-[#9D7BFF]">{SITE.tagline}</p>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {SITE.nameAr} · تجربة تعليمية عربية آمنة
        </p>
      </div>
    </footer>
  );
}
