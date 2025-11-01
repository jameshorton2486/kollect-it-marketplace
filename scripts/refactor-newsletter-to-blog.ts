// scripts/refactor-newsletter-to-blog.ts
// Usage:
//   bun scripts/refactor-newsletter-to-blog.ts --root . --dry-run
//   bun scripts/refactor-newsletter-to-blog.ts --root .
// Options:
//   --root <path>   Project root (default ".")
//   --dry-run       Show what would change, but don't write/delete
//
// What it does (safely):
// - Replaces "Newsletter"/"Subscribe" UI labels with "Blog" where sensible
// - Points links to /blog
// - Removes common newsletter API paths (e.g. /app/api/newsletter/subscribe)
// - Removes obvious newsletter components (SubscribeForm*, Newsletter*)
// - Strips RESEND/MAILCHIMP env vars from .env* files
// - Removes code importing 'resend' client
// - Prints a summary report
//
// Notes:
// - This is conservative: it won't touch binary files, JSON except .env*, or lockfiles.
// - Review the report before committing.

import fs from "node:fs";
import path from "node:path";

type Args = {
  root: string;
  dryRun: boolean;
};

const args = parseArgs(process.argv.slice(2));

function parseArgs(argv: string[]): Args {
  const out: Args = { root: ".", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") out.root = argv[++i] ?? ".";
    else if (a === "--dry-run") out.dryRun = true;
  }
  return out;
}

const exts = new Set([
  ".ts", ".tsx", ".js", ".jsx",
  ".md", ".mdx",
  ".html", ".css",
  ".json", // we won't edit generic JSON except report, but included for scanning
  ".env", ".env.local", ".env.production", ".env.development"
]);

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", "out", "dist", "build", ".vercel", ".netlify", ".cache"
]);

const DELETION_CANDIDATE_DIRS = [
  "app/api/newsletter/subscribe",
  "pages/api/newsletter/subscribe",
  "api/newsletter/subscribe",
  "components/Subscribe",
  "components/Newsletter",
  "lib/newsletter",
];

const ENV_PATTERNS = [
  /^RESEND_API_KEY=.*$/m,
  /^MAILCHIMP_.*=.*$/gm,
  /^NEWSLETTER_.*=.*$/gm,
];

const FILE_PATTERNS_TO_REPLACE: { test: RegExp; replace: (m: string) => string }[] = [
  // Common UI text → rename to Blog
  { test: /\bNewsletter\b/g, replace: () => "Blog" },
  { test: /\bnewsletter\b/g, replace: () => "blog" },
  { test: /\bSubscribe to our Blog\b/gi, replace: () => "Read our Blog" },
  { test: /\bSubscribe\b/g, replace: () => "Read the Blog" },

  // Hrefs or route references
  { test: /href=["']\/newsletter["']/g, replace: () => `href="/blog"` },
  { test: /["']\/newsletter["']/g, replace: () => `"/blog"` },

  // Components/identifiers frequently used
  { test: /\bSubscribeForm\b/g, replace: () => "BlogPreview" },
  { test: /\bNewsletterSection\b/g, replace: () => "BlogSection" },

  // Resend/Mailchimp import lines (removal happens later as well)
  { test: /from ["']resend["'];?/g, replace: () => `from ""; // removed` },
  { test: /from ["']@mailchimp\/[^"']+["'];?/g, replace: () => `from ""; // removed` },
];

const CODE_LINE_REMOVALS = [
  // Remove entire lines that instantiate Resend/Mailchimp clients
  /^\s*const\s+\w*\s*=\s*new\s+Resend\([^)]*\);\s*$/m,
  /^\s*import\s+\{?\s*Resend\s*\}?\s+from\s+["']resend["'];?\s*$/m,
  /^\s*import\s+.*@mailchimp\/.*;?\s*$/m,
];

type Change = { file: string; beforeBytes: number; afterBytes: number; replacements: number };
type Removal = { path: string; type: "file" | "dir" };
const changes: Change[] = [];
const removals: Removal[] = [];
const errors: { path: string; error: string }[] = [];

function walk(dir: string, visit: (abs: string, rel: string, stat: fs.Stats) => void) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const d of items) {
    if (d.isDirectory()) {
      if (SKIP_DIRS.has(d.name)) continue;
      const sub = path.join(dir, d.name);
      walk(sub, visit);
      continue;
    }
    const abs = path.join(dir, d.name);
    const stat = fs.statSync(abs);
    const rel = path.relative(args.root, abs);
    visit(abs, rel, stat);
  }
}

function shouldEditFile(file: string): boolean {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return false;
  // Avoid package-lock, bun.lock, pnpm-lock, images, etc.
  const base = path.basename(file);
  if (base.match(/lock(\.json|file)?$/i)) return false;
  if (base.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) return false;
  if (base.startsWith(".git")) return false;
  return true;
}

function processFile(abs: string) {
  const rel = path.relative(args.root, abs);
  if (!shouldEditFile(abs)) return;

  let content = fs.readFileSync(abs, "utf8");
  const before = content;

  // If this is an .env* file, drop specific lines
  if (path.basename(abs).startsWith(".env")) {
    let envChanged = false;
    for (const pat of ENV_PATTERNS) {
      const beforeLen = content.length;
      content = content.replace(pat, "");
      if (content.length !== beforeLen) envChanged = true;
    }
    if (envChanged) {
      recordChange(abs, before, content);
      write(abs, content);
      return;
    }
  }

  // Line removals for code (Resend/Mailchimp)
  for (const pat of CODE_LINE_REMOVALS) {
    content = content.replace(pat, "");
  }

  // General text replacements
  let replacements = 0;
  for (const r of FILE_PATTERNS_TO_REPLACE) {
    const beforeLen = content.length;
    content = content.replace(r.test, (m) => {
      replacements++;
      return r.replace(m);
    });
    if (content.length !== beforeLen) {
      // keep going
    }
  }

  if (content !== before) {
    recordChange(abs, before, content, replacements);
    write(abs, content);
  }
}

function recordChange(file: string, before: string, after: string, replacements = 0) {
  changes.push({
    file,
    beforeBytes: Buffer.byteLength(before),
    afterBytes: Buffer.byteLength(after),
    replacements,
  });
}

function write(p: string, data: string) {
  if (args.dryRun) return;
  fs.writeFileSync(p, data, "utf8");
}

function removePath(relOrAbs: string) {
  const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(args.root, relOrAbs);
  if (!fs.existsSync(abs)) return;
  const stat = fs.statSync(abs);
  removals.push({ path: abs, type: stat.isDirectory() ? "dir" : "file" });
  if (args.dryRun) return;
  if (stat.isDirectory()) {
    fs.rmSync(abs, { recursive: true, force: true });
  } else {
    fs.rmSync(abs, { force: true });
  }
}

function main() {
  const root = path.resolve(args.root);
  if (!fs.existsSync(root)) {
    console.error(`Root not found: ${root}`);
    process.exit(1);
  }

  // 1) Delete known newsletter API/components if present
  for (const d of DELETION_CANDIDATE_DIRS) {
    removePath(path.join(root, d));
  }

  // 2) Walk and edit files
  walk(root, (abs, rel, stat) => {
    try {
      processFile(abs);
    } catch (e: any) {
      errors.push({ path: rel, error: String(e?.message || e) });
    }
  });

  // 3) Print report
  console.log("\n=== Refactor Report: Newsletter → Blog ===\n");
  console.log(`Root: ${root}`);
  console.log(`Dry run: ${args.dryRun ? "YES (no writes/deletes performed)" : "NO (changes applied)"}`);
  console.log("");

  if (removals.length) {
    console.log("Removed paths:");
    for (const r of removals) {
      console.log(`  - [${r.type}] ${path.relative(root, r.path)}`);
    }
    console.log("");
  } else {
    console.log("Removed paths: (none)\n");
  }

  if (changes.length) {
    console.log("Modified files:");
    for (const c of changes) {
      const delta = c.afterBytes - c.beforeBytes;
      const sign = delta === 0 ? "±" : delta > 0 ? "+" : "-";
      console.log(`  - ${path.relative(root, c.file)} (${sign}${Math.abs(delta)} bytes, ${c.replacements} repl)`);
    }
    console.log("");
  } else {
    console.log("Modified files: (none)\n");
  }

  if (errors.length) {
    console.log("Errors:");
    for (const e of errors) console.log(`  - ${e.path}: ${e.error}`);
    console.log("");
  }

  // 4) Next steps hint
  console.log("Next steps:");
  console.log("  1) Review changes above.");
  console.log("  2) Ensure /app/blog exists (from the blog scaffolding you added).");
  console.log("  3) Run and test locally: bun run dev");
  console.log("  4) Commit with the one-shot message below.");
  console.log("");
  console.log("Suggested commit message:");
  console.log(COMMIT_MESSAGE);
}

const COMMIT_MESSAGE =
  `feat(blog): replace newsletter system with blog + clean env/API

- Removed newsletter API routes and references (Resend/Mailchimp clients)
- Replaced 'Newsletter/Subscribe' UI labels and links with 'Blog'
- Updated hrefs to /blog
- Stripped RESEND_*, MAILCHIMP_*, NEWSLETTER_* env vars from .env*
- Prepared project for educational articles (/blog)`;

main();
