# Pharmacards

Flashcards for Indian MD Pharmacology theory exam prep. You get study cards and a Rapid Fire mode for quick recall. Scheduling uses FSRS spaced repetition. A weak/strong analysis shows which topics need work. Cards are grounded in standard textbooks.

All progress is saved in your browser (IndexedDB).

## Install (users)

- **Web / PWA:** open https://aswanthwuhan.github.io/Pharma-Cards/ in Chrome, Edge or Safari, then choose "Install app" or "Add to Home screen". It works offline after the first visit.
- **iPhone / iPad:** open https://aswanthwuhan.github.io/Pharma-Cards/ in **Safari**, tap Share, then "Add to Home Screen". It opens full screen like an app and works offline. (There is no App Store build: that needs a paid Apple developer account.)
- **Windows:** download `Pharmacards-Setup-x.y.z.exe` from [GitHub Releases](https://github.com/aswanthwuhan/Pharma-Cards/releases). The installer is unsigned, so SmartScreen shows a warning. Click "More info", then "Run anyway".
- **macOS:** download the `.dmg` from [Releases](https://github.com/aswanthwuhan/Pharma-Cards/releases). The app is unsigned, so the first time, right-click it and choose Open.
- **Android:** download `Pharmacards-x.y.z.apk` from [Releases](https://github.com/aswanthwuhan/Pharma-Cards/releases). Allow "Install unknown apps" for your browser or file manager, then open the file.

## Install (developers)

You need Node.js 20 or newer (https://nodejs.org). The setup script checks this, installs packages, validates the content and runs the tests. It needs no admin rights.

- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File scripts/setup.ps1`
- **macOS / Linux:** `bash scripts/setup.sh`

Then:

```
npm run dev        # dev server at http://localhost:3000
npm run build      # static site in out/ (runs content validation first)
npm test           # unit tests
npm run validate:content
```

## Content and sources

- Each card is written in our own words and points to a chapter in a standard textbook (for example `KDT8 ch52`). No book text is included in this repository.
- Review books (Rapid Revision, Sarkar, Prep) are cited by 5-page range of their OCR text (e.g. `Sarkar p221-225`).
- Where no book covers a syllabus point, cards come from official web sources (refs start with `WEB`, flagged for review). Where neither exists, cards are marked `UNSOURCED - owner must verify`. See `content/SOURCE-GAPS.md`.
- Layout of `content/`:
  - `decks/` - study cards, one JSON file per topic.
  - `rapid/` - Rapid Fire cards, one JSON file per topic.
  - `subtopics/` - subtopic lists used for browsing.
  - `review/` - grounding log for each topic (ok / corrected / deleted).
  - `*.md` files at the top level - card format and grounding rules.
  - `all.json`, `subtopics.json` - generated bundles; do not edit by hand.

## Desktop / Android builds

Placeholder commands; these scripts are being added:

```
npm run desktop:dev   # Electron app in development
npm run dist:win      # Windows installer (.exe)
npm run dist:mac      # macOS disk image (.dmg)
npm run android:apk   # Android APK
```
