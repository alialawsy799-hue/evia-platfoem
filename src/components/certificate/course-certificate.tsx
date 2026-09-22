import Image from "next/image";
import { SITE } from "@/lib/constants";

export type CourseCertificateData = {
  studentName: string;
  courseTitle: string;
  courseSubtitle: string;
  instructorName: string;
  issuedAtLabel: string;
  certificateId: string;
};

function Seal() {
  return (
    <div className="relative mt-2 grid size-[104px] shrink-0 place-items-center sm:size-[120px]">
      <svg viewBox="0 0 120 120" className="absolute inset-0" aria-hidden>
        <defs>
          <linearGradient id="evia-seal" x1="18" y1="8" x2="104" y2="112">
            <stop offset="0%" stopColor="#9D7BFF" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#evia-seal)" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="white" strokeWidth="2" strokeDasharray="3 4" />
        <path d="M38 104h44l-8 12H46z" fill="#7C5CFF" />
        <path d="M34 104h10l-4 14z" fill="#9D7BFF" />
        <path d="M76 104h10l4 14z" fill="#9D7BFF" />
      </svg>
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <Image
          src="/brand/evia-logo.png"
          alt=""
          width={28}
          height={32}
          className="mb-1 h-7 w-auto object-contain"
          unoptimized
        />
        <span className="text-[10px] font-black leading-none">إتمام</span>
      </div>
    </div>
  );
}

export function CourseCertificate({ data }: { data: CourseCertificateData }) {
  return (
    <article
      dir="ltr"
      className="certificate-sheet relative isolate overflow-hidden bg-white text-[#161022] shadow-[0_24px_60px_rgba(70,40,160,0.16)]"
    >
      <div className="pointer-events-none absolute -right-[20%] -top-[48%] h-[82%] w-[64%] rotate-[-32deg] bg-[#f3eeff]" />
      <div className="pointer-events-none absolute -right-[8%] -top-[34%] h-[62%] w-[44%] rotate-[-32deg] bg-gradient-to-bl from-[#9D7BFF]/30 to-[#7C5CFF]/10" />
      <div className="pointer-events-none absolute -bottom-[36%] -left-[24%] h-[74%] w-[60%] rounded-[999px] bg-gradient-to-r from-[#7C5CFF] to-[#9D7BFF]" />
      <div className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[44%] w-[36%] rounded-[999px] bg-[#7C5CFF]/85" />

      <div className="relative z-10 flex min-h-[560px] flex-col justify-between px-8 py-8 sm:min-h-[620px] sm:px-12 sm:py-10 md:px-14">
        <header className="flex items-center gap-3">
          <Image
            src="/brand/evia-logo.png"
            alt={SITE.name}
            width={52}
            height={58}
            className="h-12 w-auto object-contain sm:h-14"
            unoptimized
            priority
          />
          <div className="leading-tight">
            <p className="text-sm font-extrabold tracking-[0.28em] text-[#7C5CFF] sm:text-base">
              {SITE.name}
            </p>
            <p className="text-xs font-medium text-[#6b6288]">{SITE.nameAr}</p>
          </div>
        </header>

        <div className="mt-8 flex items-start justify-between gap-6">
          <div dir="rtl" className="max-w-[72%] text-right">
            <h1 className="text-5xl font-black tracking-tight text-[#7C5CFF] sm:text-6xl md:text-7xl">
              شهادة
            </h1>
            <p className="mt-2 text-sm font-extrabold tracking-[0.32em] text-[#2a2440] sm:text-base">
              إتمام الدورة
            </p>
            <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-[#6b6288] sm:text-sm">
              تقدَّم هذه الشهادة إلى
            </p>
            <p className="mt-3 text-3xl font-black text-[#7C5CFF] sm:text-4xl md:text-[42px]">
              {data.studentName}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[#5b5470]">
              وذلك لإتمامه بنجاح {data.courseTitle} لدى منصة إيفيا، وفق متطلبات المسار التدريبي
              {data.courseSubtitle ? ` (${data.courseSubtitle})` : ""}.
            </p>
          </div>
          <Seal />
        </div>

        <footer className="relative z-10 mt-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-[#2a2440]">{data.issuedAtLabel}</p>
            <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-[#7C5CFF]">
              التاريخ
            </p>
          </div>
          <div className="text-right">
            <p dir="rtl" className="text-sm font-bold text-[#2a2440]">
              {data.instructorName}
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-[#7C5CFF]">التوقيع</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
