"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

const StickyCartBar = dynamic(
  () => import("@/components/product/StickyCartBar"),
  { ssr: false },
);

interface ClientProductLayoutProps extends PropsWithChildren {
  product: { title: string; price: number };
}

export default function ClientProductLayout({
  children,
  product,
}: ClientProductLayoutProps) {
  return (
    <>
      {children}
      <StickyCartBar product={product} />
    </>
  );
}
