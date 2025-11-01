"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    if (status === "unauthenticated") router.push("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-serif font-bold text-ink mb-2">
          Admin Settings
        </h1>
        <p className="text-sm text-ink-secondary mb-6">
          Configure administrative options. Coming soon.
        </p>
        <div className="rounded-lg border border-border-neutral bg-white p-6 text-ink-secondary">
          Placeholder: settings controls will appear here.
        </div>
      </div>
    </div>
  );
}
