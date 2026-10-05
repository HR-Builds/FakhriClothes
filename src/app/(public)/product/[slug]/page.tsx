import { db } from "@/lib/db";
import { parseJson, formatPKR } from "@/lib/utils";
import { getSessionUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/shop/ProductGallery";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ReviewsSection from "@/components/shop/ReviewsSection";
import ProductCard from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  
  const { slug } = await params;

const product = await db.product.findUnique({
  where: { slug },
});
  if (!product) notFound();

  const images = parseJson<string[]>(product.images, []);
  const reviews = await db.review.findMany({
    where: { productId: product.id, approved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  const related = await db.product.findMany({
    where: { collectionName: product.collectionName, id: { not: product.id } },
    take: 4,
  });
  const user = await getSessionUser();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-14">
        <ProductGallery images={images} name={product.name} />

        <div>
          <p className="text-gold-dark uppercase tracking-[0.3em] text-sm mb-2">{product.collectionName}</p>
          <h1 className="font-serif text-3xl md:text-5xl mb-4">{product.name}</h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6">{formatPKR(product.price)}</p>

          <div className="space-y-3 text-emerald/80 mb-8">
            <p><span className="font-semibold text-emerald">Fabric:</span> {product.fabric}</p>
            <p><span className="font-semibold text-emerald">Availability:</span>{" "}
              {product.stockQty > 0
                ? <span className="text-emerald">{product.stockQty} in stock</span>
                : <span className="text-maroon font-semibold">Out of stock</span>}
            </p>
            <p><span className="font-semibold text-emerald">Delivery:</span> Flat PKR 290 — 5–6 business days, anywhere in Pakistan</p>
          </div>

          <p className="text-emerald/80 leading-relaxed mb-8">{product.description}</p>

          <AddToCartButton productId={product.id} stockQty={product.stockQty} />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/category/${product.category}`} className="btn-outline text-sm">More {product.category.replace("-", " ")}</Link>
          </div>
        </div>
      </div>

      <ReviewsSection productId={product.id} loggedIn={!!user}
        reviews={reviews.map((r) => ({
          id: r.id, rating: r.rating, comment: r.comment,
          createdAt: r.createdAt.toISOString(), userName: r.user.name,
        }))} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title">You may also like</h2>
          <span className="gold-underline" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
            {related.map((p) => (
              <ProductCard key={p.id} slug={p.slug} name={p.name} collectionName={p.collectionName}
                price={p.price} image={parseJson<string[]>(p.images, [])[0] || ""} stockQty={p.stockQty} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}