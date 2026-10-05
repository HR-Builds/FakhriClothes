import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import HeroCarousel from "@/components/home/HeroCarousel";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import CategoryTiles from "@/components/home/CategoryTiles";
import BrandStory from "@/components/home/BrandStory";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import ProductCard from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await db.homepageContent.findUnique({ where: { id: 1 } });
  const banners = content ? parseJson<{ title: string; subtitle: string; image: string; cta: string }[]>(content.banners, []) : [];
  const featuredIds = content ? parseJson<string[]>(content.featuredProductIds, []) : [];

  const featured = featuredIds.length
    ? await db.product.findMany({ where: { id: { in: featuredIds } } })
    : await db.product.findMany({ where: { featured: true }, take: 8 });

  return (
    <>
      <HeroCarousel banners={banners} />
      <MarqueeStrip />
      <CategoryTiles />

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">New Arrivals & Featured</h2>
          <span className="gold-underline mx-auto" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} slug={p.slug} name={p.name} collectionName={p.collectionName}
              price={p.price} image={parseJson<string[]>(p.images, [])[0] || ""} stockQty={p.stockQty} />
          ))}
        </div>
      </section>

      <BrandStory title={content?.storyTitle || "The Fakhri Story"}
        text={content?.storyText || "Premium unstitched women's wear, crafted with care."} />

      <NewsletterSignup />
    </>
  );
}