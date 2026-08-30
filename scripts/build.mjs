import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";

rmSync("dist", { recursive: true, force: true });

const files = [
  "manifest.json",
  "popup.html",
  "popup.css",
  "src/popup.mjs",
  "src/receipt.mjs",
];

for (const file of files) {
  const destination = `dist/${file}`;
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(file, destination);
}

console.log(`build: copied ${files.length} extension files to dist/`);
