import fs from "fs";
import path from "path";

// cwd = ...\focusly\focusly\docs-site
const from = path.resolve(process.cwd(), "build");

// go up TWO levels: ...\focusly\focusly\docs-site -> ...\focusly\focusly -> ...\focusly
const repoRoot = path.resolve(process.cwd(), "..", "..");

const docsRoot = path.resolve(repoRoot, "docs");
const to = path.resolve(docsRoot, "focusly-docs");

if (!fs.existsSync(from)) {
  console.error(`Build folder not found: ${from}`);
  process.exit(1);
}

if (!fs.existsSync(docsRoot)) {
  console.error(`Expected docs folder not found: ${docsRoot}`);
  console.error(`Tip: update repoRoot calculation if your folder layout differs.`);
  process.exit(1);
}

// Only replace docs/focusly-docs
fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });
fs.cpSync(from, to, { recursive: true });

console.log(`Copied Docusaurus build:\n  ${from}\n-> ${to}`);