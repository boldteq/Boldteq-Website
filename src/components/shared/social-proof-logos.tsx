import { cn } from "@/lib/utils";

const LOGOS = [
  "Forbes",
  "Entrepreneur",
  "Inc.",
  "Washington Post",
  "Philadelphia",
  "Technically",
];

export function SocialProofLogos({ className }: { className?: string }) {
  return (
    <div className={cn("py-8", className)}>
      <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
        As Featured In
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {LOGOS.map((name) => (
          <span
            key={name}
            className="text-lg font-semibold text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
