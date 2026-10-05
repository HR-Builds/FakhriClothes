"use client";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";

export type CardProduct = {
  id: string; slug: string; name: string; price: number;
  collectionName: string; stockQty: number; image: string;
};

export default function CategoryClient({ products, collections }: { products: CardProduct[]; collections: string[] }) {
  const [collection, setCollection] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = [...products];
    if (collection !== "all") list = list.filter((p) => p.collectionName === collection);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, collection, sort]);

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-luxe">Collection</label>
          <select value={collection} onChange={(e) => setCollection(e.target.value)} className="input-luxe">
            <option value="all">All Collections</option>
            {collections.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxe">Sort by</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-luxe">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <p className="text-emerald/60 text-sm mb-6">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <p className="text-center text-emerald/60 py-16">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} slug={p.slug} name={p.name} collectionName={p.collectionName}
              price={p.price} image={p.image} stockQty={p.stockQty} />
          ))}
        </div>
      )}
    </div>
  );
}