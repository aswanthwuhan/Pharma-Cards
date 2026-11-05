import pkg from "../package.json";

export const APP_VERSION = pkg.version;

/** Newest first. Add an entry for every release; the app shows the newest one once after an update. */
export const CHANGELOG: { version: string; changes: string[] }[] = [
  {
    version: "0.5.13",
    changes: [
      "Every release now ships together: Windows and macOS installers, the Android APK, and the web app (PWA) on GitHub Pages",
    ],
  },
  {
    version: "0.5.12",
    changes: [
      "macOS app: one universal installer that runs on both Apple Silicon and Intel Macs",
      "Opening the macOS app the first time: right-click → Open, until the build is signed by Apple",
    ],
  },
  {
    version: "0.5.11",
    changes: [
      "Space or Enter now turns the card back over as well as revealing it",
      "Undo with U, Escape or Ctrl/⌘ Z — and on a fresh card the opposite arrow brings the last card back",
      "New How to use page: every gesture and keyboard key in one place (Settings, or the desktop sidebar)",
    ],
  },
  {
    version: "0.5.10",
    changes: [
      "Faster start: the card content loads on demand instead of up front on every screen",
      "Screen readers can read the whole card, and long answers scroll with the arrow keys",
      "New Skip button and S key: pass a card without marking it wrong",
      "Skip to content link, bigger tap targets, and your phone's Reduce Motion setting is followed",
      "A custom accent colour now also sets its hover and button text colours, with a contrast warning in Settings",
      "Today and Mastery only switch to their wide layouts where the columns actually fit",
    ],
  },
  {
    version: "0.5.9",
    changes: [
      "New app icon: teal and coral pill on flashcards (replaces the blue P)",
      "Every new card from the last releases re-checked against its source: about 950 corrected, unsupported ones removed",
      "Cards for the last past-paper questions with no textbook source, marked for review",
      "Now 5,091 study and 21,865 Rapid Fire cards",
    ],
  },
  {
    version: "0.5.8",
    changes: [
      "Cards fact-checked against the textbooks across all four papers: corrected details and exact page sources",
      "More cards: now 5,044 study and 21,762 Rapid Fire",
    ],
  },
  {
    version: "0.5.7",
    changes: [
      "Night mode cards are dim and easy on the eyes: dark card, soft off-white text, no glare",
      "Custom colours: pick your own background, panels, text, accent, card background and card text in Settings",
      "Choose your app icon from 11 designs in Settings (iPhone: Add to Home Screen again to see it)",
      "Paper III: 150 more study cards and 662 more Rapid Fire cards on clinical services, ethics, national programmes and research",
      "Keyboard: Escape closes pop-ups, arrow keys move through option groups",
      "Easier to read: no text smaller than 11px, bigger tap areas on Mastery checkboxes, even line breaks",
      "A proper Page not found screen",
    ],
  },
  {
    version: "0.5.6",
    changes: [
      "About 2,200 new study cards and 4,300 new Rapid Fire cards across all 53 topics, now 4,944 study and 21,315 Rapid Fire",
      "Every card has a level: basic, applied or advanced. Each subtopic opens the next level once you know the one below",
      "Sessions run basic to advanced, so each one has a flow",
      "Past-paper coverage: about 95% of exam questions now have a card",
      "Weak and strong are steadier: unseen cards count, labels stop flipping at the line, and strong needs the advanced cards",
      "Essay cards: choose Ladder or Rail view",
      "Web app for iPhone, iPad and any browser: open it in Safari and choose Add to Home Screen",
      "Thinner, fainter scroll bars",
    ],
  },
  {
    version: "0.5.5",
    changes: [
      "Android Back steps back one screen; on home it asks before closing",
      "Tap the card to flip it either way; double tap skips it to the end of the queue",
      "Rapid Fire uses the same card: 4-way swipe, header and grade buttons",
      "Long essays: open each heading after recalling it, and mark it recalled or missed",
      "Up/down swipes only from the card's bottom edge, so scrolling never grades (set it in Settings)",
      "Fixed the per-card time and the minutes estimate on Today",
      "Faster screen changes on Android",
    ],
  },
  {
    version: "0.5.4",
    changes: [
      "Update check on launch: shows a dialog when a newer release is on GitHub",
      "Android builds use the same signing key, so installs update in place",
    ],
  },
  {
    version: "0.5.3",
    changes: [
      "48 new cards for frequently asked past-paper questions (with Rapid Fire cards)",
      "All PrepLadder-derived references removed; cards re-grounded in your textbooks",
    ],
  },
  {
    version: "0.5.2",
    changes: [
      "Practicals: rabbit eye (mydriatics and miotics) and Snellen chart cards",
      "Practicals: dog blood pressure cards for autonomic drugs (MAP and HR)",
      "Android: Back steps back through the app; on the home screen it asks before closing",
      "Back button on every page",
    ],
  },
];
