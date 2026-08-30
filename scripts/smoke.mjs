import { readFileSync, existsSync } from "node:fs";
import { createReceipt, toMarkdown, withFingerprint } from "../src/receipt.mjs";

const manifest = JSON.parse(readFileSync("dist/manifest.json", "utf8"));
if (manifest.manifest_version !== 3) throw new Error("manifest must use MV3");
if (!manifest.permissions.includes("activeTab") || !manifest.permissions.includes("scripting")) {
  throw new Error("manifest is missing least-privilege capture permissions");
}
if (manifest.permissions.includes("tabs") || manifest.permissions.includes("storage")) {
  throw new Error("manifest requests unnecessary permissions");
}
for (const file of ["dist/popup.html", "dist/popup.css", "dist/src/popup.mjs", "dist/src/receipt.mjs"]) {
  if (!existsSync(file)) throw new Error(`missing build output: ${file}`);
}

const receipt = await withFingerprint(createReceipt({
  quote: "A source should travel with the claim.",
  title: "Example",
  url: "https://example.com/",
  capturedAt: "2026-08-29T17:00:00.000Z",
}));
if (!toMarkdown(receipt).includes("Fingerprint: `sha256:")) throw new Error("receipt export failed");

console.log(`fingerprint: ${receipt.fingerprint}`);
console.log(toMarkdown(receipt));
console.log("smoke: ok");
