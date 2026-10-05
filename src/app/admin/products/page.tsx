import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-gold text-sm">+ Add Product</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[700px]">
            <thead>
              <tr><th>Name</th><th>Collection</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.collectionName}</td>
                  <td className="capitalize">{p.category.replace("-", " ")}</td>
                  <td>{formatPKR(p.price)}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stockQty === 0 ? "bg-maroon/10 text-maroon" : p.stockQty <= 5 ? "bg-gold/15 text-gold-dark" : "bg-emerald/10 text-emerald"}`}>
                      {p.stockQty === 0 ? "Out" : p.stockQty}
                    </span>
                  </td>
                  <td>{p.featured ? "★" : "—"}</td>
                  <td className="whitespace-nowrap">
                    <Link href={`/admin/products/${p.id}`} className="text-gold-dark hover:underline mr-3">Edit</Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="p-8 text-center text-emerald/50">No products yet — add your first one!</p>}
      </div>
    </div>
  );
}
