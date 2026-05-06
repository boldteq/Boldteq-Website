// Page-level body background images (matches Webflow body class equivalents)

import React from "react";

/** Rectangle-1-1.png background — matches Webflow body.body-gradient-image */
export function GradientPageBg({ pricing = false }: { pricing?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: pricing ? "600px" : "1200px",
        zIndex: -1,
        pointerEvents: "none",
        backgroundImage: "url('/images/webflow/Rectangle-1-1.png')",
        backgroundSize: pricing ? "100% 600px" : "100% 1200px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: pricing ? "50% 0" : "0 0",
      }}
    />
  );
}

/** Rectangle-1-2.png background — matches Webflow body.bg-gradient-body.work-body */
export function WorkPageBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        backgroundImage: "url('/images/webflow/Rectangle-1-2.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 0",
      }}
    />
  );
}
