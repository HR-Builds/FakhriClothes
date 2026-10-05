"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPKR } from "@/lib/utils";

type Props = {
  slug: string;
  name: string;
  collectionName: string;
  price: number;
  image: string;
  stockQty: number;
};

export default function ProductCard({ slug, name, collectionName, price, image, stockQty }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/product/${slug}`} className="card-luxe block group">
        <div className="relative aspect-[4/5] overflow-hidden bg-emerald/5">
          {image ? (
            <Image src={image} alt={name} width={600} height={750}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald/30 font-serif text-4xl">F</div>
          )}
          {stockQty <= 0 && (
            <span className="absolute top-3 left-3 bg-maroon text-cream text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-4 md:p-5">
          <p className="text-xs uppercase tracking-widest text-gold-dark">{collectionName}</p>
          <h3 className="font-serif text-lg md:text-xl mt-1 group-hover:text-gold-dark transition-colors">{name}</h3>
          <p className="mt-2 font-semibold text-emerald">{formatPKR(price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}