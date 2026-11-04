"use client";

import Link from "next/link";

/** A keyboard key. */
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-rule bg-well px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
      {children}
    </kbd>
  );
}

function KeyRow({ keys, children }: { keys: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-2 last:border-0">
      <span className="flex flex-wrap items-center gap-1">{keys}</span>
      <span className="text-sm text-ink-soft">{children}</span>
    </div>
  );
}

function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="sheet space-y-2 rounded-xl p-5">
      <h2 id={id} className="font-serif text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Help() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="eyebrow">Guide</p>
        <h1 className="font-serif text-4xl">How to use</h1>
        <p className="text-sm text-ink-soft">
          Everything the study screen responds to, on a phone or with a keyboard.
        </p>
      </header>

      <Panel id="card" title="The study card">
        <ul className="space-y-2 text-sm">
          <li>
            <b>Tap the card</b> to flip between the question and the answer. Tap again to turn it back.
          </li>
          <li>
            <b>Double tap</b> to skip a card without grading it. There is also a <b>Skip</b> button.
          </li>
          <li>
            <b>Swipe left</b> for Forgot, <b>right</b> for Good. <b>Swipe up</b> for Easy and <b>down</b> for
            Hard from the edge zone (the thin strip at the bottom of the card by default; turn the outline
            on in Settings to see it).
          </li>
          <li>
            <b>Drag up and down</b> anywhere else on the card to scroll a long answer.
          </li>
          <li>
            Prefer buttons? The four grades sit under the card with the next interval on each one.
          </li>
          <li>
            <b>Notes</b>: the pencil button keeps a mnemonic or correction for that card; it saves as you type.
          </li>
        </ul>
      </Panel>

      <Panel id="keys" title="Keyboard">
        <div className="space-y-0">
          <KeyRow keys={<><Kbd>Space</Kbd> <span className="text-sm text-ink-soft">or</span> <Kbd>Enter</Kbd></>}>
            show the answer, press again to turn the card back
          </KeyRow>
          <KeyRow keys={<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> <Kbd>4</Kbd></>}>
            grade Forgot / Hard / Good / Easy
          </KeyRow>
          <KeyRow
            keys={
              <>
                <Kbd>←</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd> <Kbd>→</Kbd>
              </>
            }
          >
            grade the flipped card: left Forgot, up Easy, down Hard, right Good
          </KeyRow>
          <KeyRow
            keys={
              <>
                <Kbd>U</Kbd> <span className="text-sm text-ink-soft">or</span> <Kbd>Esc</Kbd>{" "}
                <span className="text-sm text-ink-soft">or</span> <Kbd>Ctrl/⌘ Z</Kbd>
              </>
            }
          >
            undo the last grade; the card comes back
          </KeyRow>
          <KeyRow keys={<><Kbd>←</Kbd> <span className="text-sm text-ink-soft">after grading right</span></>}>
            the opposite direction on a fresh card also brings the previous card back
          </KeyRow>
          <KeyRow keys={<Kbd>S</Kbd>}>skip without grading</KeyRow>
        </div>
        <p className="pt-2 text-sm text-ink-soft">
          Arrows only grade a card that is already flipped, so on a fresh card they undo instead — turn the
          card over first and they grade it.
        </p>
      </Panel>

      <Panel id="rapid" title="Rapid fire">
        <p className="text-sm">
          Two-way recall: the same fact seen from the other side. Tap or press <Kbd>Space</Kbd> to flip, then
          answer <b>Knew it</b> or <b>Didn&apos;t know</b> — or use the same keys: <Kbd>1</Kbd> didn&apos;t
          know, <Kbd>3</Kbd> knew it, <Kbd>S</Kbd> skip, <Kbd>U</Kbd> undo. At the end you get the cards you
          missed, ready to review.
        </p>
      </Panel>

      <Panel id="start" title="Where to start">
        <ul className="space-y-2 text-sm">
          <li>
            <b>Today</b> gives you the daily queue — new cards plus the ones due for review, already ordered.
          </li>
          <li>
            <b>Syllabus</b> browses all four papers; open a topic to study it, or build a custom mix by paper,
            topic, card type or past-year questions only.
          </li>
          <li>
            <b>Mastery</b> shows what is weak and what is exam-ready; pick topics there to practise them.
          </li>
          <li>
            <b>Saved</b> holds the cards you bookmarked.
          </li>
        </ul>
        <p className="pt-1 text-sm text-ink-soft">
          Grades follow spaced repetition: each card comes back just before you would forget it.
        </p>
      </Panel>

      <Panel id="installing" title="Install it like an app">
        <ul className="space-y-2 text-sm">
          <li>
            <b>iPhone / iPad</b>: Safari → Share → <b>Add to Home Screen</b>.
          </li>
          <li>
            <b>Mac</b>: Safari → <b>File → Add to Dock</b> (or Chrome → Install).
          </li>
          <li>
            <b>Android</b>: Chrome → menu → <b>Install app</b>.
          </li>
          <li>
            <b>Windows</b>: run the Pharmacards installer from the releases page.
          </li>
        </ul>
        <p className="pt-1 text-sm text-ink-soft">
          Once installed it opens full screen and works offline; your progress stays on the device.
        </p>
      </Panel>

      <Panel id="customise" title="Make it yours">
        <ul className="space-y-2 text-sm">
          <li>
            <b>Settings → Appearance</b>: Day, Night or Auto, five palettes, and your own colours. A custom
            accent sets its own hover, selected and button-text colours, and Settings warns you if a pair falls
            below 4.5:1 contrast.
          </li>
          <li>
            <b>Motion</b>: follows your phone&apos;s Reduce Motion setting by default; you can force it on or off.
          </li>
          <li>
            <b>Swipe</b>: turn card swiping off, change which edge grades up/down, or show the zone outline.
          </li>
          <li>
            <b>App icon</b>: pick one of the designs in Settings (iPhone: add to Home Screen again to see it).
          </li>
        </ul>
        <p className="pt-1 text-sm">
          <Link href="/settings" className="font-semibold text-teal underline-offset-2 hover:underline">
            Open Settings
          </Link>
        </p>
      </Panel>
    </div>
  );
}
