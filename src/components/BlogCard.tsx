import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog";

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <article className="blog-card border rounded-xl overflow-hidden">
      {post.image ? (
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full h-48 object-cover"
          priority={false}
        />
      ) : null}
      <div className="p-4">
        <h3 className="text-xl font-semibold leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-sm opacity-70 mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>{" "}
          · {post.author}
        </p>
        {post.excerpt ? (
          <p className="opacity-80 mb-3">{post.excerpt}</p>
        ) : null}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-block underline underline-offset-4"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
