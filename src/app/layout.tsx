import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SITE } from "@/lib/constants";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.nameAr} | ${SITE.name}`,
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${tajawal.variable} ${tajawal.className}`}>
      <body className={`${tajawal.className} min-h-screen font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
