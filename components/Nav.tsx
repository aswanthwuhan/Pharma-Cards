"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavBack } from "@/components/NavBack";

const ICONS = {
  today: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  syllabus: "M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13",
  mastery: "M12 3a9 9 0 1 0 9 9M12 3v9h9M12 3a9 9 0 0 1 9 9",
  saved: "M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z",
  settings: "M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4",
  review: "M4 5h16v11H8l-4 4zM8 10h8",
  help: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.1 9a3 3 0 1 1 4.6 2.6c-.9.6-1.7 1.1-1.7 2.4M12 17h.01",
};

// Bottom tabs on phones (5 max); the desktop rail also shows Review.
const TABS = [
  { href: "/", label: "Today", icon: ICONS.today },
  { href: "/browse", label: "Syllabus", icon: ICONS.syllabus },
  { href: "/stats", label: "Mastery", icon: ICONS.mastery },
  { href: "/bookmarks", label: "Saved", icon: ICONS.saved },
  { href: "/settings", label: "Settings", icon: ICONS.settings },
];
const RAIL = [
  ...TABS.slice(0, 4),
  { href: "/admin", label: "Review cards", icon: ICONS.review },
  TABS[4],
  { href: "/help", label: "How to use", icon: ICONS.help },
];

function Icon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/**
 * Phones: slim header + thumb-level tab dock. Desktop (lg+): fixed left rail, as in the Stitch desktop screens.
 * Hidden on the study screen, which has its own chrome.
 */
export function Nav() {
  const path = usePathname();
  if (path.startsWith("/study")) return null;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <>
      {/* phone / tablet header */}
      <header className="glass sticky top-0 z-20 border-x-0 border-t-0 pt-[env(safe-area-inset-top)] lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
          {path !== "/" && <NavBack />}
          <Link href="/" className="flex items-center gap-2 font-serif text-xl">
            <Capsule />
            Pharmacards
          </Link>
        </div>
      </header>

      {/* desktop rail */}
      <aside className="glass fixed inset-y-0 left-0 z-20 hidden w-64 flex-col rounded-none border-y-0 border-l-0 px-3 py-6 lg:flex" aria-label="Main">
        <Link href="/" className="mb-8 flex items-center gap-2 px-3 font-mono text-sm font-semibold tracking-[0.12em] uppercase">
          <Capsule />
          Pharmacards
        </Link>
        {path !== "/" && <NavBack className="mb-4 ml-3 self-start" />}
        <nav className="flex flex-col gap-1">
          {RAIL.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 font-mono text-sm tracking-wide uppercase transition-colors ${
                active(l.href) ? "bg-teal font-semibold text-on-teal" : "text-ink-soft hover:bg-teal-wash hover:text-ink"
              }`}
            >
              <Icon d={l.icon} size={20} />
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* phone dock */}
      <nav
        aria-label="Main"
        className="glass fixed inset-x-0 bottom-0 z-20 flex border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {TABS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active(l.href) ? "page" : undefined}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 font-mono text-[11px] tracking-wide uppercase ${active(l.href) ? "text-teal" : "text-ink-soft"}`}
          >
            <Icon d={l.icon} />
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Capsule() {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden>
      <rect x="0.5" y="0.5" width="25" height="13" rx="6.5" fill="none" stroke="currentColor" />
      <path d="M7 0.5h6v13H7a6.5 6.5 0 0 1 0-13z" className="fill-teal" />
    </svg>
  );
}
