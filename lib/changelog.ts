import pkg from "../package.json";

export const APP_VERSION = pkg.version;

/** Newest first. Add an entry for every release; the app shows the newest one once after an update. */
export const CHANGELOG: { version: string; changes: string[] }[] = [
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
