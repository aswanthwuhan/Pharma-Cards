// Builds a debug APK with Gradle and copies it to release/Pharmacards-<version>.apk.
// Picks gradlew.bat on Windows and ./gradlew elsewhere.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const androidDir = join(root, "android");
const isWin = process.platform === "win32";
// Quoted absolute path: the project path contains spaces, and cmd ignores cwd for bare names.
const gradlew = isWin ? `"${join(androidDir, "gradlew.bat")}"` : join(androidDir, "gradlew");

// Gradle needs JDK 17 or 21. Prefer Android Studio's bundled JBR when JAVA_HOME is unset.
const studioJbr = "C:\\Program Files\\Android\\Android Studio\\jbr";
const env = { ...process.env };
if (!env.JAVA_HOME && isWin && existsSync(studioJbr)) env.JAVA_HOME = studioJbr;

const gradle = spawnSync(gradlew, ["assembleDebug"], {
  cwd: androidDir,
  env,
  stdio: "inherit",
  shell: isWin,
});
if (gradle.status !== 0) process.exit(gradle.status ?? 1);

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const apkSrc = join(androidDir, "app", "build", "outputs", "apk", "debug", "app-debug.apk");
const releaseDir = join(root, "release");
const apkDst = join(releaseDir, `Pharmacards-${pkg.version}.apk`);
mkdirSync(releaseDir, { recursive: true });
copyFileSync(apkSrc, apkDst);
console.log(`APK copied to ${apkDst}`);
