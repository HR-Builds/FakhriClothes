import { db } from "@/lib/db";
import { formatPKR, parseJson } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [paidOrders, allOrders, customers, products, pendingReviews, lowStock] = await Promise.all([
    db.order.findMany({ where: { paymentStatus: "SUCCESS" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.user.count({ where: { isAdmin: false } }),
    db.product.count(),
    db.review.count({ where: { approved: false } }),
    db.product.findMany({ where: { stockQty: { lte: 5 } }, take: 6 }),
  ]);

  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);

  // Best sellers from paid orders
  const counts: Record<string, { name: string; qty: number; revenue: number }> = {};
  for (const o of paidOrders) {
    for (const it of parseJson<{ name: string; qty: number; price: number }[]>(o.items, [])) {
      if (!counts[it.name]) counts[it.name] = { name: it.name, qty: 0, revenue: 0 };
      counts[it.name].qty += it.qty;
      counts[it.name].revenue += it.qty * it.price;
    }
  }
  const bestSellers = Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const stats = [
    { label: "Total Revenue", value: formatPKR(revenue) },
    { label: "Orders", value: String(allOrders.length) },
    { label: "Paid Orders", value: String(paidOrders.length) },
    { label: "Customers", value: String(customers) },
    { label: "Products", value: String(products) },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card text-center">
            <p className="text-xl md:text-2xl font-serif text-gold-dark">{s.value}</p>
            <p className="text-xs text-emerald/60 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-serif text-xl mb-4">Best Sellers</h2>
          {bestSellers.length === 0 ? <p className="text-emerald/50 text-sm">No sales yet.</p> : (
            <table className="admin-table w-full">
              <thead><tr><th>Product</th><th>Qty</th><th>Revenue</th></tr></thead>
              <tbody>
                {bestSellers.map((b) => (
                  <tr key={b.name}><td>{b.name}</td><td>{b.qty}</td><td>{formatPKR(b.revenue)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-gold-dark hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {allOrders.map((o) => (
              <Link key={o.id} href="/admin/orders" className="flex justify-between items-center text-sm border-b border-emerald/5 pb-2 hover:text-gold-dark">
                <span>#{o.id.slice(-8).toUpperCase()} · {o.customerName}</span>
                <span className="font-semibold">{formatPKR(o.total)}</span>
              </Link>
            ))}
            {allOrders.length === 0 && <p className="text-emerald/50 text-sm">No orders yet.</p>}
          </div>
          {pendingReviews > 0 && (
            <Link href="/admin/reviews" className="inline-block mt-4 text-sm bg-gold/15 text-gold-dark px-3 py-1.5 rounded-full">
              {pendingReviews} review{pendingReviews !== 1 ? "s" : ""} awaiting approval →
            </Link>
          )}
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-card lg:col-span-2">
          <h2 className="font-serif text-xl mb-4">Low Stock Alert (≤ 5 left)</h2>
          {lowStock.length === 0 ? <p className="text-emerald/50 text-sm">All products well stocked ✓</p> : (
            <div className="flex flex-wrap gap-2">
              {lowStock.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`}
                  className={`text-sm px-4 py-2 rounded-full border ${p.stockQty === 0 ? "bg-maroon/10 text-maroon border-maroon/20" : "bg-gold/10 text-gold-dark border-gold/20"}`}>
                  {p.name} — {p.stockQty === 0 ? "OUT" : `${p.stockQty} left`}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}