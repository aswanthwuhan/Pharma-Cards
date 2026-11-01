"use client";

import { usePathname } from "next/navigation";

/**
 * Replays the page-entry fade and rise on each route change. Keyed on the path so the
 * animation runs on navigation, not only on first load. The study screen is a full-bleed
 * fixed overlay, and a transformed ancestor would trap it, so it is left alone.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/study")) return children;
  return (
    <div key={path} className="page-enter">
      {children}
    </div>
  );
}
