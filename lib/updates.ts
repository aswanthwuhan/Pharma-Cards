const LATEST = "https://api.github.com/repos/aswanthwuhan/Pharma-Cards/releases/latest";

/** True when semver-like `a` is newer than `b` (e.g. "0.5.10" > "0.5.9"). */
export function isNewer(a: string, b: string) {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d > 0;
  }
  return false;
}

/** Newest published version from GitHub, or undefined when offline or the request fails. */
export async function latestVersion(): Promise<string | undefined> {
  try {
    const res = await fetch(LATEST, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return undefined;
    const tag: string = (await res.json()).tag_name ?? "";
    return tag.replace(/^v/, "") || undefined;
  } catch {
    return undefined;
  }
}
