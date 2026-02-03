import { existsSync, rmSync, renameSync } from "node:fs";
import { resolve } from "node:path";

const from = resolve(process.cwd(), "out");
const to = resolve(process.cwd(), ".out");

if (!existsSync(from)) {
  console.error("Static export folder not found at ./out. Did the build succeed?");
  process.exit(1);
}

if (existsSync(to)) {
  rmSync(to, { recursive: true, force: true });
}

renameSync(from, to);
console.log("Static export moved to .out/");
