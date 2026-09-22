"use client";

import { Button } from "@/components/ui/button";

export function PrintCertificateButton() {
  return (
    <Button type="button" className="print:hidden" onClick={() => window.print()}>
      طباعة الشهادة / حفظ PDF
    </Button>
  );
}
