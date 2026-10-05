import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import SearchBox from "./SearchBox";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim();

  const products = q
    ? await db.product.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { collectionName: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: 60,
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <h1 className="section-title">Search</h1>
        <span className="gold-underline mx-auto" />
      </div>
      <div className="max-w-xl mx-auto mb-12">
        <SearchBox initial={q} />
      </div>
      {q && (
        <p className="text-center text-emerald/60 mb-8">
          {products.length} result{products.length !== 1 ? "s" : ""} for “{q}”
        </p>
      )}
      {q && products.length === 0 && (
        <p className="text-center text-emerald/60 py-16">No products found. Try a different search.</p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} slug={p.slug} name={p.name} collectionName={p.collectionName}
            price={p.price} image={parseJson<string[]>(p.images, [])[0] || ""} stockQty={p.stockQty} />
        ))}
      </div>
    </div>
  );
}