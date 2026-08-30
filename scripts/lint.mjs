import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collect(path) : /\.(mjs|js)$/.test(entry.name) ? [path] : [];
  });
}

const forbidden = [
  ["eval(", "dynamic code execution"],
  ["innerHTML", "HTML injection sink"],
  ["localStorage", "implicit persistence"],
  ["sessionStorage", "implicit persistence"],
  ["fetch(", "network upload"],
  ["XMLHttpRequest", "network upload"],
];

for (const file of collect("src").concat(collect("scripts"))) {
  if (file.endsWith("lint.mjs")) continue;
  const source = readFileSync(file, "utf8");
  for (const [needle, reason] of forbidden) {
    if (source.includes(needle)) throw new Error(`${file}: forbidden ${reason}: ${needle}`);
  }
}

console.log("lint: ok");
