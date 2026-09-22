import { NavigationProgress } from "@/components/layout/navigation-progress";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteHeader } from "@/components/layout/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationProgress />
      <SiteHeader />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
