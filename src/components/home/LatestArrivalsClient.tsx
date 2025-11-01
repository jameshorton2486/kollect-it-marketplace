"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LatestArrivals() {
  const items = [
    {
      title: "19th-C. Gilt Frame Mirror",
      img: "https://ik.imagekit.io/kollectit/latest1.jpg",
      desc: "Victorian • London • c. 1880",
    },
    {
      title: "Art Deco Bronze Figurine",
      img: "https://ik.imagekit.io/kollectit/latest2.jpg",
      desc: "France • c. 1930",
    },
    {
      title: "Stanley Mouse 1966 Poster",
      img: "https://ik.imagekit.io/kollectit/latest3.jpg",
      desc: "Jefferson Airplane • Original",
    },
    {
      title: "Tsavorite Garnet 6.12 ct",
      img: "https://ik.imagekit.io/kollectit/latest4.jpg",
      desc: "Merelani Hills • Tanzania",
    },
  ];

  return (
    <section className="ki-section bg-white">
      <div className="ki-container text-center">
        <h2 className="text-4xl text-navy font-semibold mb-6 ki-gold-underline">
          Latest Arrivals
        </h2>
        <p className="text-ink-secondary mb-12">
          Newly added antiques and collectibles — authenticated, documented, and
          ready for your collection.
        </p>

        <div className="ki-grid sm:grid-cols-2 gap-10">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative ki-card ki-round overflow-hidden"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={600}
                height={400}
                className="object-cover w-full h-64"
              />
              {/* Hover overlay CTA */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                <span className="pointer-events-auto inline-block rounded border-2 border-brand-gold px-4 py-2 text-[12px] uppercase tracking-wide text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy">
                  View Details
                </span>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-2xl text-navy mb-2">{item.title}</h3>
                <p className="text-ink-secondary">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-12 text-ink-secondary text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Each piece tells a story of craftsmanship and heritage. Our
          specialists continually source new treasures to elevate your personal
          collection.
        </motion.p>
      </div>
    </section>
  );
}
