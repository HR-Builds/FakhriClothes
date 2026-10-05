import { db } from "@/lib/db";
import { formatPKR, parseJson } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";

export const dynamic = "force-dynamic";

const PAYMENT_STYLES: Record<string, string> = {
  SUCCESS: "bg-emerald/15 text-emerald",
  PENDING: "bg-gold/15 text-gold-dark",
  FAILED: "bg-maroon/10 text-maroon",
};

export default async function AdminOrders() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Orders</h1>
      <p className="text-sm text-emerald/60 mb-6">
        Book courier on PostEx manually, then update status here. Customers see updates instantly on their account and the Track Order page.
      </p>

      {orders.length === 0 ? (
        <p className="bg-white rounded-2xl p-8 shadow-card text-center text-emerald/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = parseJson<{ name: string; qty: number; price: number }[]>(o.items, []);
            return (
              <details key={o.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
                <summary className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 cursor-pointer list-none">
                  <div>
                    <p className="font-semibold">#{o.id.slice(-8).toUpperCase()} · {o.customerName}</p>
                    <p className="text-xs text-emerald/50">
                      {new Date(o.createdAt).toLocaleString("en-PK")} · {items.reduce((s, i) => s + i.qty, 0)} items · {formatPKR(o.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_STYLES[o.paymentStatus]}`}>{o.paymentStatus}</span>
                    <span className="text-emerald/40 group-open:rotate-90 transition-transform">▸</span>
                  </div>
                </summary>
                <div className="border-t border-emerald/10 p-4 md:p-5 grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Items</p>
                    {items.map((it, i) => (
                      <p key={i} className="text-emerald/70">{it.name} × {it.qty} — {formatPKR(it.price * it.qty)}</p>
                    ))}
                    <p className="mt-2 pt-2 border-t border-emerald/10 font-semibold">Total: {formatPKR(o.total)} (incl. delivery)</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Customer</p>
                    <p>{o.customerName}</p>
                    <p className="text-emerald/70">{o.customerPhone}</p>
                    <p className="text-emerald/70">{o.customerEmail}</p>
                    <p className="text-emerald/70 mt-2">
                      {o.flatNo}, {o.buildingName},<br />{o.area}, {o.city} — {o.zipCode}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Fulfillment</p>
                    {o.paymentStatus === "SUCCESS" ? (
                      <OrderStatusSelect orderId={o.id} current={o.orderStatus} />
                    ) : (
                      <p className="text-maroon">Payment {o.paymentStatus.toLowerCase()} — no action needed</p>
                    )}
                    {o.shippedAt && <p className="text-xs text-emerald/50 mt-2">Dispatched: {new Date(o.shippedAt).toLocaleDateString("en-PK")}</p>}
                    {o.deliveredAt && <p className="text-xs text-emerald/50">Delivered: {new Date(o.deliveredAt).toLocaleDateString("en-PK")}</p>}
                    {o.gatewayTransactionId && (
                      <p className="text-xs text-emerald/50 mt-3">Transaction: {o.gatewayTransactionId}</p>
                    )}
                    <div className="mt-3">
                      <DeleteOrderButton id={o.id} />
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}