import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { ExitGuard } from "@/components/NavBack";
import { UpdateCheck } from "@/components/UpdateCheck";
import { WhatsNew } from "@/components/WhatsNew";
import { Nav } from "@/components/Nav";
import { PageEnter } from "@/components/PageEnter";
import { ThemeApplier } from "@/components/ThemeApplier";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Pharmacards — MD Pharmacology revision",
  description: "Spaced-repetition flashcards for MD Pharmacology theory exams",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/manifest.webmanifest`,
  // iPhone/iPad: Safari "Add to Home Screen" opens full screen with this icon (iOS ignores manifest icons).
  appleWebApp: { capable: true, title: "Pharmacards", statusBarStyle: "black-translucent" },
  icons: { apple: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icons/icon-192.png` },
};

export const viewport: Viewport = {
  themeColor: "#091a1d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

const THEME_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("pharmacards:theme")||"{}"),t=s.theme||"dark",r=document.documentElement;r.dataset.theme=t==="auto"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t;r.dataset.palette=s.palette||"petrol";for(var k in s.colors||{})r.style.setProperty(k,s.colors[k]);var P={petrol:{dark:"#091a1d",light:"#ecfcff"},ocean:{dark:"#0a1424",light:"#eef5ff"},plum:{dark:"#160f1c",light:"#fbf5ff"},graphite:{dark:"#111214",light:"#f6f6f4"},sepia:{dark:"#1a1510",light:"#f7f1e3"}},q=P[r.dataset.palette]||P.petrol,paper=(s.colors&&s.colors["--color-paper"])||getComputedStyle(r).getPropertyValue("--color-paper").trim()||q[r.dataset.theme==="light"?"light":"dark"],mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.setAttribute("content",paper);if(s.appIcon&&s.appIcon!=="original")for(var n of["icon","apple-touch-icon"]){var l=document.querySelector('link[rel="'+n+'"]')||document.head.appendChild(Object.assign(document.createElement("link"),{rel:n}));l.href="${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icons/choices/"+s.appIcon+"-180.png"}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${newsreader.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint (settings live in async IndexedDB; ThemeApplier mirrors them here). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:mx-3 focus:my-3 focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-teal"
        >
          Skip to content
        </a>
        <ThemeApplier />
        <RegisterSW />
        <Nav />
        <ExitGuard />
        <WhatsNew />
        <UpdateCheck />
        {/* Phones: one column. Desktop: content beside the 16rem rail, up to 72rem wide. */}
        <div className="lg:pl-64">
          <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-5 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:max-w-6xl lg:px-10 lg:pt-8 lg:pb-12">
            <PageEnter>{children}</PageEnter>
          </main>
        </div>
      </body>
    </html>
  );
}
