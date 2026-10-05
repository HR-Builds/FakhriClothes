import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Edit: {product.name}</h1>

      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          collectionName: product.collectionName,
          category: product.category,
          price: product.price,
          fabric: product.fabric,
          description: product.description,
          images: parseJson<string[]>(product.images, []).join("\n"),
          stockQty: product.stockQty,
          featured: product.featured,
        }}
      />
    </div>
  );
}