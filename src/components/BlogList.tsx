import BlogCard from "./BlogCard";
import type { PostMeta } from "@/lib/blog";

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  return (
    <section
      aria-label="Blog articles"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((p) => (
        <BlogCard key={p.slug} post={p} />
      ))}
    </section>
  );
}
