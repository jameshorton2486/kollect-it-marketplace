"use client";

import { useEffect } from "react";
import NewsletterModal from "@/components/NewsletterModal";
import LuxuryEnhancements from "@/components/LuxuryEnhancements";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      {children}
      <NewsletterModal delaySeconds={30} />
      <LuxuryEnhancements />
    </div>
  );
}
