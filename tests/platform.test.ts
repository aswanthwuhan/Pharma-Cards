import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

describe("platform files", () => {
  // A syntax error here silently disables offline support (registration failure is swallowed).
  it("service worker parses", () => {
    expect(() => new Script(readFileSync("public/sw.js", "utf8"))).not.toThrow();
  });
});
