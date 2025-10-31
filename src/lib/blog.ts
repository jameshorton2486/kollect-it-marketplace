import fs from "node:fs";
import path from "node:path";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO
  author: string;
  image?: string;
  excerpt?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPostsMeta(): PostMeta[] {
  const jsonPath = path.join(CONTENT_DIR, "posts.json");
  const raw = fs.readFileSync(jsonPath, "utf8");
  const arr = JSON.parse(raw) as PostMeta[];
  return arr.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } {
  const list = getAllPostsMeta();
  const meta = list.find((p) => p.slug === slug);
  if (!meta) throw new Error(`Post not found: ${slug}`);
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  const content = fs.readFileSync(mdPath, "utf8");
  return { meta, content };
}

export async function markdownToHtml(md: string): Promise<string> {
  try {
    const { marked } = await import("marked");
    return marked.parse(md) as string;
  } catch {
    let html = md
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1<\/blockquote>")
      .replace(/^\- (.*$)/gim, "<li>$1<\/li>")
      .replace(/\n{2,}/g, "</p><p>");
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
    return `<p>${html}</p>`;
  }
}
