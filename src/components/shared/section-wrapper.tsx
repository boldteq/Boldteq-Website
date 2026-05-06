import { cn } from "@/lib/utils";

type SectionVariant = "light" | "dark" | "navy" | "gradient" | "muted";

const variantStyles: Record<SectionVariant, string> = {
  light: "bg-background text-foreground",
  dark: "bg-brand-navy text-white",
  navy: "bg-brand-navy-deep text-white",
  gradient: "gradient-cyan text-white",
  muted: "bg-muted text-foreground",
};

export function SectionWrapper({
  variant = "light",
  className,
  children,
  id,
}: {
  variant?: SectionVariant;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn(variantStyles[variant], "py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
