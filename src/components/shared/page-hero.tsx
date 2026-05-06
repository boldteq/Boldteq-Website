import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PageHero({
  title,
  subtitle,
  badge,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-brand-navy py-20 text-center text-white md:py-28",
        className
      )}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {badge && (
          <Badge
            variant="secondary"
            className="mb-4 bg-white/10 text-white hover:bg-white/20"
          >
            {badge}
          </Badge>
        )}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
