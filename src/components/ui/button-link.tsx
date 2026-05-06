import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";

interface ButtonLinkProps
  extends VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function ButtonLink({
  href,
  children,
  className,
  variant,
  size,
  external,
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
