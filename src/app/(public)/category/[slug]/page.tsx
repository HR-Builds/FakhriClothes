import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";
import { parseJson } from "@/lib/utils";
import CategoryClient, {
  CardProduct,
} from "@/components/shop/CategoryClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const cat = CATEGORIES.find((c) => c.slug === slug);

  if (!cat) {
    notFound();
  }

  const products = await db.product.findMany({
    where: {
      category: slug,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const collections = [
    ...new Set(products.map((p) => p.collectionName)),
  ];

  const items: CardProduct[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    collectionName: p.collectionName,
    stockQty: p.stockQty,
    image: parseJson<string[]>(p.images, [])[0] || "",
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <p className="text-gold-dark uppercase tracking-[0.3em] text-sm mb-2">
          {cat.desc}
        </p>

        <h1 className="section-title">
          {cat.label}
        </h1>

        <span className="gold-underline mx-auto" />
      </div>

      <CategoryClient
        products={items}
        collections={collections}
      />
    </div>
  );
}