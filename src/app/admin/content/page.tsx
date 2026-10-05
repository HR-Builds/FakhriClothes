import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContent() {
  const content = await db.homepageContent.findUnique({ where: { id: 1 } });
  const products = await db.product.findMany({
    select: { id: true, name: true, collectionName: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Homepage Content</h1>
      <p className="text-sm text-emerald/60 mb-6">Edit banners, featured products and the brand story — changes go live instantly, no developer needed.</p>
      <ContentEditor
        banners={content ? parseJson(content.banners, []) : []}
        featuredIds={content ? parseJson<string[]>(content.featuredProductIds, []) : []}
        storyTitle={content?.storyTitle || ""}
        storyText={content?.storyText || ""}
        products={products}
      />
    </div>
  );
}