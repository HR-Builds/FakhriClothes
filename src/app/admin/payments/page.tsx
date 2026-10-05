import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAYMENT_STYLES: Record<string, string> = {
  SUCCESS: "bg-emerald/15 text-emerald",
  PENDING: "bg-gold/15 text-gold-dark",
  FAILED: "bg-maroon/10 text-maroon",
};

export default async function AdminPayments() {
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
  const provider = process.env.PAYMENT_PROVIDER === "safepay" ? "Safepay (LIVE)" : "Mock Gateway (TEST MODE)";

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Payments & Gateway</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-emerald/50 mb-1">Active Gateway</p>
          <p className="font-serif text-xl">{provider}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-emerald/50 mb-1">Safepay Keys</p>
          <p className="font-serif text-xl">{process.env.SAFEPAY_API_KEY ? "✓ Configured" : "Not set (test mode)"}</p>
        </div>
      </div>

      <h2 className="font-serif text-xl mb-4">Transaction Log</h2>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[640px]">
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Transaction Ref</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-medium">#{o.id.slice(-8).toUpperCase()}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-PK")}</td>
                  <td>{o.customerName}</td>
                  <td>{formatPKR(o.total)}</td>
                  <td>Bank</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs font-bold ${PAYMENT_STYLES[o.paymentStatus]}`}>{o.paymentStatus}</span></td>
                  <td className="text-xs text-emerald/60">{o.gatewayTransactionId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && <p className="p-8 text-center text-emerald/50">No transactions yet.</p>}
      </div>
    </div>
  );
}