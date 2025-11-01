#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
const patterns = [
  /style=\{\{/g,          // React style object
  /style=\"[^\"]+\"/g, // string inline style
];

/**
 * Recursively walk a directory and return file paths
 */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (exts.has(path.extname(entry.name))) out.push(p);
  }
  return out;
}

function scan(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const lines = txt.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const re of patterns) {
      if (re.test(line)) {
        hits.push({ line: i + 1, snippet: line.trim().slice(0, 200) });
        break;
      }
    }
  }
  return hits;
}

if (!fs.existsSync(ROOT)) {
  console.error(`No src directory found at ${ROOT}`);
  process.exit(1);
}

const files = walk(ROOT);
let total = 0;
for (const f of files) {
  const res = scan(f);
  if (res.length) {
    console.log(`\n${path.relative(process.cwd(), f)}:`);
    for (const r of res) {
      total++;
      console.log(`  ${r.line}: ${r.snippet}`);
    }
  }
}

if (total === 0) {
  console.log('No inline styles found.');
} else {
  console.log(`\nFound ${total} inline style occurrence(s).`);
}
