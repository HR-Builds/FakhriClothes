"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandStory({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-emerald text-cream py-16 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-3">Since forever, crafted for you</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-6">{title}</h2>
          <p className="text-cream/80 text-lg leading-relaxed">{text}</p>
          <Link href="/about" className="btn-gold mt-8">Our Story</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="rounded-2xl overflow-hidden shadow-luxe">
            <Image src="https://picsum.photos/seed/story/900/1100" alt="Fakhri Clothes story" width={900} height={1100} className="object-cover w-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}