import * as React from "react";
import clsx from "clsx";

type SectionProps = {
  variant?: "default" | "alt" | "elevated";
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export function Section({
  variant = "default",
  children,
  className = "",
  ...props
}: SectionProps) {
  const variantStyles: Record<NonNullable<SectionProps["variant"]>, string> = {
    default: "bg-surface",
    alt: "section-alt",
    elevated: "section-elevated",
  };

  return (
    <section
      className={clsx(
        "py-12 md:py-16 lg:py-20",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}

export default Section;
