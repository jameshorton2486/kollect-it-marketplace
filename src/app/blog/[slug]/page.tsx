import { getAllPostsMeta, getPostBySlug, markdownToHtml } from "@/lib/blog";
import Image from "next/image";
import type { Metadata } from "next";

type Params = { slug: string };

export async function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  const url = `/blog/${meta.slug}`;
  return {
    title: `${meta.title} | Kollect-It`,
    description: meta.excerpt || meta.title,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.excerpt || meta.title,
      type: "article",
      url,
      images: meta.image ? [{ url: meta.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const html = await markdownToHtml(content);

  return (
    <main className="container max-w-3xl mx-auto px-4 py-10">
      <article className="prose prose-invert max-w-none article-content">
        <header className="mb-6">
          <h1 className="text-3xl font-bold leading-tight">{meta.title}</h1>
          <p className="text-sm opacity-75 mt-1">
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>{" "}
            · {meta.author}
          </p>
        </header>

        {meta.image ? (
          <Image
            src={meta.image}
            alt={meta.title}
            width={1200}
            height={600}
            className="w-full h-auto rounded-xl mb-6"
            priority={false}
          />
        ) : null}

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
