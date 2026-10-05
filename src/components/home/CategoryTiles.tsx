"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";

const IMAGES: Record<string, string> = {
  shirts: "/uploads/shirt.png",
  "two-piece": "/uploads/category-two-piece.png",
  "three-piece": "/uploads/category-three-piece.png",
};

export default function CategoryTiles() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="section-title">Shop by Category</h2>
        <span className="gold-underline mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Link
              href={`/category/${c.slug}`}
              className="group relative block overflow-hidden rounded-2xl shadow-card aspect-[4/5]"
            >
              <Image
                src={IMAGES[c.slug] || IMAGES.shirts}
                alt={c.label}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-emerald/90 via-emerald/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold-light text-xs uppercase tracking-widest mb-1">
                  {c.desc}
                </p>

                <h3 className="font-serif text-2xl md:text-3xl text-cream">
                  {c.label}
                </h3>

                <p className="text-gold-light mt-2 text-sm transition-colors">
                  Explore →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}