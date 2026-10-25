import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SITE } from "@/lib/constants";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.nameAr} | ${SITE.name}`,
  description: SITE.description,
  icons: {
    icon: "/brand/evia-icon.png",
    apple: "/brand/evia-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className={`${ibmPlexArabic.className} min-h-screen font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
