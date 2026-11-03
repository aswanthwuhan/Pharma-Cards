import pkg from "../package.json";

export const APP_VERSION = pkg.version;

/** Newest first. Add an entry for every release; the app shows the newest one once after an update. */
export const CHANGELOG: { version: string; changes: string[] }[] = [
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
