import type { Metadata } from "next";
import Link from "next/link";
import { CourseCertificate } from "@/components/certificate/course-certificate";
import { PrintCertificateButton } from "@/components/certificate/print-certificate-button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `شهادة إتمام · مطور مواقع | ${SITE.nameAr}`,
  description: "شهادة إتمام كورس مطور مواقع من منصة إيفيا.",
};

const CERTIFICATE = {
  studentName: "محمد علي أحمد",
  courseTitle: "كورس مطور مواقع",
  courseSubtitle: "مسار تطوير الويب · بناء واجهات حديثة بـ React و Next.js",
  instructorName: "دكتور علي الاوسي",
  issuedAtLabel: "22 سبتمبر 2026",
  certificateId: "EVIA-WD-2026-0922",
};

export default function CertificatePage() {
  return (
    <main className="certificate-page min-h-screen bg-muted px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto mb-6 flex w-[min(1100px,100%)] flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/" className="text-sm font-medium text-primary transition hover:text-foreground">
          العودة إلى إيفيا
        </Link>
        <PrintCertificateButton />
      </div>
      <div className="mx-auto w-[min(1100px,100%)] overflow-hidden rounded-[6px]">
        <CourseCertificate data={CERTIFICATE} />
      </div>
    </main>
  );
}
