# Pharmacards design system (for anyone building a screen)

The visual source is the user's Stitch export: `C:\Users\albit\Downloads\stitch_pharmacards_flagship_study_experience (1)\stitch_pharmacards_flagship_study_experience\`. Each screen folder has a `screen.png`; look at the one for your page before you build it. **Copy the look, not the words.**

## Look
- **Chassis:** dark petrol page (`bg-paper`) with panels in `bg-sheet` and `border-rule` hairlines (`sheet` / `card-surface` utilities). Recessed wells use `bg-well`.
- **Accent:** pale mint `teal` (use `btn-primary` for the main action; text on mint is `text-on-teal`). `bg-teal-wash` marks selected or hovered rows.
- **Porcelain:** the warm porcelain slab (`porcelain` utility, `text-porcelain-ink`) is ONLY for the study card. Don't use it on other screens.
- **Mastery colours:** `weak` (coral), `moderate` (amber), `strong` (emerald), `unseen`. Only for mastery. Get them from `LABEL_COLOR`.
- **Type:**
  - `font-serif` (Newsreader) for page titles, card prompts and big numbers' labels.
  - `font-sans` (Hanken Grotesk) for body text.
  - `font-mono` (JetBrains Mono) for numbers, counts, intervals and small labels. The `eyebrow` utility gives a small uppercase mono label.
- **Shapes:** panels are `rounded-xl`. Fully round capsules only for mastery meters, chips and buttons.

## Words
Plain, short, sentence case, from the student's side: "Work on weak areas", "3 of 8 cards seen", "Exam in 42 days". Do **not** copy the mockups' jargon ("telemetry", "metrology", "specimen", "calibration", "RUN-77B", fake ATC codes). Never invent data. Show only what the app really knows.

## Shared building blocks (use these; don't re-create them)
- `components/MasteryPill.tsx`:
  - `<MasteryPill m={mastery} />`: capsule meter + label + score.
  - `<CapsuleMeter m={mastery} />`: just the 5-cell capsule.
  - `LABEL_COLOR`, `LABEL_TEXT`.
- `components/SubtopicList.tsx`: `<SubtopicList topicId mastery={report.subtopic} order="weakest" | "syllabus" />` gives tappable rows that start practice on one subtopic.
- `components/BottomSheet.tsx`: `<BottomSheet open onClose title>…</BottomSheet>`.
- `components/BlisterMap.tsx`: the signature syllabus pill map (topic pills filled by mastery).

## Data
- `lib/store.ts`:
  - `useMastery()` returns `{ topic, subtopic, tag }`, each a `Map<id, TopicMastery>` (or undefined while loading). `TopicMastery` has `score` (0–100 or null), `label`, `coverage` (0–1), `cards` and `reviews`.
  - `weakest(map, n)` returns rated, non-strong groups, weakest first.
  - `useStudyCards()` / `useAllCards()`.
- `lib/syllabus.ts`:
  - `PAPERS` (each has `topics`, each topic has `subtopics: {id,title}[]` and `refs`).
  - `topicById`, `subtopicById`.
- `lib/types.ts`: `TAG_LABEL` (question type names, e.g. adr → "Adverse effects"), `TAGS`.
- `lib/db.ts`: Dexie tables (`cardStates`, `reviews`, `bookmarks`, `notes`, `snapshots`), plus `getSetting` / `setSetting`. Read them with `useLiveQuery` from `dexie-react-hooks`.

## Study links (all go to `/study`)
- `?mode=daily`
- `?mode=weak`
- `?mode=random&n=50`
- `?mode=diagnostic`
- `?mode=topic&topic=<topicId>`
- `?mode=topic&subtopic=<subtopicId>`
- `?mode=topic&tag=<tag>`
- `?mode=bookmarks`
- Optional extras: `&types=basic,essay`, `&pyq=1`

## Quality floor
- Mobile first at 375px.
- Touch targets at least 44px (`btn*` utilities already are).
- Visible focus (global), semantic `<button>`/`<Link>`, `aria-label` on icon-only buttons.
- No `transition-all`. At most one motion moment per screen. Gate hover-only effects behind `hover:` (Tailwind v4 already does).
- Reduced motion is respected globally.
- Empty states tell the user what to do next.

## v3 additions (Stitch revamp)
- **Two themes.** Dark "instrument" (default) and light "workspace" (`<html data-theme="light">`). Every colour token flips automatically. Never hard-code hex colours in pages; always use the tokens (`bg-paper`, `bg-sheet`, `text-ink`, `bg-teal`…), so both themes work.
- **Desktop layout.**
  - From `lg`, a fixed 16rem left rail (`components/Nav.tsx`) holds the navigation, and `<main>` grows to `max-w-6xl`.
  - Pages SHOULD use multi-column layouts at `lg:` the way the Stitch desktop screens do: dashboard 3 columns, mastery map grid plus inspector side panel.
  - Below `lg`, everything stays a single mobile column with the bottom tab dock.
- **Tabs:** Today `/`, Syllabus `/browse`, Mastery `/stats`, Saved `/bookmarks`, Settings `/settings`. Card review (`/admin`) is reached from the desktop rail and from Settings.
- **Settings API** (`lib/settings.ts`):
  - `useSettings()` returns the live `Settings` (examDate, examName, newPerDay, retention 0.80–0.97, showDrafts, swipe, haptics, theme).
  - `updateSetting(key, value)` saves one.
  - `DEFAULT_SETTINGS` holds the defaults.
- **Stitch screens to copy per page** (folder `C:\Users\albit\Downloads\stitch_pharmacards_flagship_study_experience (1)\stitch_pharmacards_flagship_study_experience\`):
  - **Today:** `pharmacards_mobile_today_dashboard_1|2` for mobile, `pharmacards_flagship_recall_instrument_desktop` for desktop.
  - **Mastery:** `pharmacards_mastery_map_workspace_desktop` (light), `pharmacards_mobile_mastery_map_topic_inspector`, `pharmacards_mobile_deficit_inspector_adrenergic_antagonists_1|2`.
  - **Syllabus:** `pharmacards_mobile_syllabus_library_topic_atlas_1|2`, `pharmacards_paper_iv_clinical_pharmacology_syllabus_desktop`, `pharmacards_mobile_practice_mix_builder_1|2`.
  - **Settings:** `pharmacards_mobile_settings_metrology`, `pharmacards_settings_metrology_workspace_desktop`, `pharmacards_tablet_settings_metrology_workspace`.
