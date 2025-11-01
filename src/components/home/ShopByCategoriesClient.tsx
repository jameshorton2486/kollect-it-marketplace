"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ShopByCategories() {
  const categories = [
    {
      title: "Antique Books",
      desc: "Scarce first editions and beautifully bound volumes.",
      img: "https://ik.imagekit.io/kollectit/cat-books.jpg",
      href: "/category/antique-books",
    },
    {
      title: "Fine Art",
      desc: "Paintings, drawings, and sculpture from documented artists.",
      img: "https://ik.imagekit.io/kollectit/cat-art.jpg",
      href: "/category/fine-art",
    },
    {
      title: "Collectibles",
      desc: "Rare memorabilia, vintage timepieces, and ephemera.",
      img: "https://ik.imagekit.io/kollectit/cat-collectibles.jpg",
      href: "/category/collectibles",
    },
    {
      title: "Militaria",
      desc: "Artifacts with verified provenance and historical importance.",
      img: "https://ik.imagekit.io/kollectit/cat-militaria.jpg",
      href: "/category/militaria",
    },
  ];

  return (
    <section className="ki-section ki-parchment">
      <div className="ki-container text-center">
        <h2 className="text-4xl text-navy font-semibold mb-6 ki-gold-underline">
          Shop by Category
        </h2>
        <p className="text-ink-secondary mb-12">
          Explore diverse categories curated for collectors, designers, and
          historians alike.
        </p>

        <div className="ki-grid sm:grid-cols-2 gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={cat.href} className="group block ki-card ki-round bg-white ki-img-zoom">
                <Image
                  src={cat.img}
                  alt={cat.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64"
                />
                <div className="p-6 text-left">
                  <h3 className="text-2xl text-navy mb-2">{cat.title}</h3>
                  <p className="text-ink-secondary leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/shop" className="ki-btn-primary">
            View All Categories
          </Link>
        </div>

        <motion.p
          className="mt-10 text-ink-secondary text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Whether you’re building a personal gallery or enhancing a curated
          space, Kollect-It makes discovery effortless with authenticity at its
          core.
        </motion.p>
      </div>
    </section>
  );
}
