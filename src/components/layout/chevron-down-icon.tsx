// ─── Shared chevron-down SVG (used by navbar + mobile-nav dropdowns) ──────────
// Presentational only: callers pass their own width/height/className/aria-hidden
// so each render is byte-identical to the previous inlined copy.

export function ChevronDownIcon({
  width = "100%",
  height = "100%",
  className,
  ariaHidden,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}
