import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";
import { ExitGuard } from "@/components/NavBack";
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
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#091a1d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

const THEME_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("pharmacards:theme")||"{}"),t=s.theme||"dark",r=document.documentElement;r.dataset.theme=t==="auto"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t;r.dataset.palette=s.palette||"petrol"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${newsreader.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint (settings live in async IndexedDB; ThemeApplier mirrors them here). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <ThemeApplier />
        <RegisterSW />
        <Nav />
        <ExitGuard />
        {/* Phones: one column. Desktop: content beside the 16rem rail, up to 72rem wide. */}
        <div className="lg:pl-64">
          <main className="mx-auto max-w-3xl px-5 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:max-w-6xl lg:px-10 lg:pt-8 lg:pb-12">
            <PageEnter>{children}</PageEnter>
          </main>
        </div>
      </body>
    </html>
  );
}
