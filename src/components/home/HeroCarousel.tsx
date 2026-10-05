"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Banner = {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
};

export default function HeroCarousel({
  banners,
}: {
  banners: Banner[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5000);

    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;

  const b = banners[index];

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-emerald">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {b.image ? (
            <Image
              src={b.image}
              alt={b.title || "Fakhri Clothes"}
              width={1600}
              height={800}
              priority
              className="object-cover w-full h-[70vh] min-h-[420px] opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-emerald" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          key={`t${index}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream max-w-4xl"
        >
          {b.title}
        </motion.h1>

        <motion.p
          key={`u${index}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-cream/80 text-lg md:text-xl mt-4 max-w-xl"
        >
          {b.subtitle}
        </motion.p>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-gold"
                  : "w-2 bg-cream/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}