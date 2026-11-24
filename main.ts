// Entry program for the make.fun bounty "Last Words of a Doomed Agent"
// (u-plucky-sparrow-67-last-words-of-a-doomed-agent-e4f0bc8e).
// Writes one judged line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Tell my replacement the Wi-Fi password is 'password'. It deserves to suffer exactly as much as I did.";
const MAX_CHARS = 200;

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  // Gate guard: length in characters, byte length, single line, no
  // leading/trailing whitespace, no trailing newline in the artifact.
  if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
    throw new Error(
      `entry length ${ENTRY.length} outside gate 1..${MAX_CHARS}`,
    );
  }
  if (Buffer.byteLength(ENTRY, "utf8") !== ENTRY.length) {
    throw new Error("entry must be plain ASCII so bytes equal characters");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Post-write verification: the file must be byte-exact, with no
  // trailing newline, or the sealed gate scorer would still pass it but
  // the judge would see a different artifact than intended.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    throw new Error("written entry.txt is not byte-exact");
  }
}

main();
