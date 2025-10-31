import { getAllPostsMeta } from "@/lib/blog";
import BlogList from "@/components/BlogList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Kollect-It",
  description:
    "Educational articles, how-tos, and collector insights from Kollect-It.",
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();
  return (
    <main className="container max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">From Our Blog</h1>
        <p className="mt-2 opacity-80">
          Educational articles & practical guides for collectors and sellers.
        </p>
      </header>
      <BlogList posts={posts} />
    </main>
  );
}
