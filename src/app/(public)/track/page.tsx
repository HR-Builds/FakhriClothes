import { db } from "@/lib/db";
import { formatPKR, parseJson } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STEPS = [
  { key: "PROCESSING", label: "Confirmed", desc: "Payment received — your order is confirmed" },
  { key: "SHIPPED", label: "Dispatched", desc: "Handed over to courier (PostEx)" },
  { key: "DELIVERED", label: "Delivered", desc: "Package received by you" },
];

export default async function TrackPage({ searchParams }: { searchParams: { code?: string; contact?: string } }) {
  const code = (searchParams.code || "").trim();
  const contact = (searchParams.contact || "").trim();

  let order: Awaited<ReturnType<typeof db.order.findFirst>> = null;
  let error = "";

  if (code && contact) {
    const cleanContact = contact.toLowerCase().replace(/[\s-]/g, "");
    order = await db.order.findFirst({
      where: {
        AND: [
          { OR: [{ id: code }, { id: { endsWith: code } }] },
          { OR: [{ customerEmail: cleanContact }, { customerPhone: cleanContact }] },
        ],
      },
    });
    if (!order) error = "No order found. Check your order number and the email/phone used at checkout.";
  }

  const currentStep = order ? STEPS.findIndex((s) => s.key === order!.orderStatus) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="section-title text-center">Track Your Order</h1>
      <span className="gold-underline mx-auto" />
      <p className="text-center text-emerald/60 mt-4 mb-8 text-sm">
        Find your order number in your account page or confirmation email (e.g. #A1B2C3D4).
      </p>

      <form method="GET" action="/track" className="bg-white rounded-2xl p-6 shadow-card space-y-4 mb-8">
        <div>
          <label className="label-luxe">Order Number</label>
          <input name="code" defaultValue={code} required placeholder="e.g. A1B2C3D4" className="input-luxe uppercase" />
        </div>
        <div>
          <label className="label-luxe">Email or Phone used at checkout</label>
          <input name="contact" defaultValue={contact} required placeholder="you@email.com or 03XX XXXXXXX" className="input-luxe" />
        </div>
        <button type="submit" className="btn-gold w-full">Track Order</button>
      </form>

      {error && <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-4 text-center">{error}</p>}

      {order && (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
          {order.paymentStatus !== "SUCCESS" ? (
            <p className="text-center text-maroon">
              Payment {order.paymentStatus.toLowerCase()} — this order is not active.
              {order.paymentStatus === "FAILED" && <> <Link href="/cart" className="underline">Retry payment</Link></>}
            </p>
          ) : (
            <>
              {/* Status timeline */}
              <div className="flex items-start mb-8">
                {STEPS.map((s, i) => {
                  const done = i <= currentStep;
                  const date =
                    i === 0 ? order.createdAt
                    : i === 1 ? order.shippedAt
                    : order.deliveredAt;
                  return (
                    <div key={s.key} className="flex-1 text-center relative">
                      {i < STEPS.length - 1 && (
                        <div className={`absolute top-5 left-1/2 w-full h-1 ${i < currentStep ? "bg-gold" : "bg-emerald/10"}`} />
                      )}
                      <div className={`relative w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm
                        ${done ? "bg-gold text-emerald" : "bg-emerald/10 text-emerald/40"}`}>
                        {done ? "✓" : i + 1}
                      </div>
                      <p className={`mt-2 text-sm font-semibold ${done ? "text-emerald" : "text-emerald/40"}`}>{s.label}</p>
                      <p className="text-xs text-emerald/50 mt-0.5 px-1">{s.desc}</p>
                      {date && <p className="text-xs text-gold-dark mt-1">{new Date(date).toLocaleDateString("en-PK")}</p>}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-emerald/10 pt-4 space-y-1 text-sm">
                <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                {parseJson<{ name: string; qty: number; price: number }[]>(order.items, []).map((it, i) => (
                  <p key={i} className="text-emerald/70">{it.name} × {it.qty} — {formatPKR(it.price * it.qty)}</p>
                ))}
                <p className="font-semibold pt-2">Total: {formatPKR(order.total)}</p>
                <p className="text-emerald/60">Delivering to: {order.flatNo}, {order.area}, {order.city}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}