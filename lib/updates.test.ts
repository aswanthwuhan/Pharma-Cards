import { expect, test } from "vitest";
import { isNewer } from "./updates";

test("compares versions numerically", () => {
  expect(isNewer("0.5.3", "0.5.2")).toBe(true);
  expect(isNewer("0.5.10", "0.5.9")).toBe(true);
  expect(isNewer("0.5.2", "0.5.2")).toBe(false);
  expect(isNewer("0.5.1", "0.5.2")).toBe(false);
  expect(isNewer("1.0.0", "0.9.9")).toBe(true);
});
