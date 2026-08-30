import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collect(path);
    return /\.(mjs|js)$/.test(entry.name) ? [path] : [];
  });
}

for (const file of collect("src").concat(collect("scripts"))) {
  if (statSync(file).isFile()) execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log("typecheck: ok");
