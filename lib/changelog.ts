import pkg from "../package.json";

export const APP_VERSION = pkg.version;

/** Newest first. Add an entry for every release; the app shows the newest one once after an update. */
export const CHANGELOG: { version: string; changes: string[] }[] = [
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
