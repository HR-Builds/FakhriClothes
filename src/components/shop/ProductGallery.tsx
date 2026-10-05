"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const list = images.length ? images : [];

  if (!list.length) {
    return <div className="aspect-[4/5] rounded-2xl bg-emerald/5 flex items-center justify-center font-serif text-6xl text-emerald/20">F</div>;
  }

  return (
    <div>
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card bg-emerald/5">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="w-full h-full">
            <Image src={list[idx]} alt={name} width={800} height={1000} priority className="object-cover w-full h-full" />
          </motion.div>
        </AnimatePresence>
      </div>
      {list.length > 1 && (
        <div className="flex gap-3 mt-4">
          {list.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`relative w-20 aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <Image src={img} alt={`${name} view ${i + 1}`} width={160} height={200} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}