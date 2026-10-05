import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPKR, parseJson } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import PaymentStatusRefresh from "@/components/orders/PaymentStatusRefresh";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-gold/15 text-gold-dark",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald/15 text-emerald",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;

  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const order = await db.order.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!order) {
    notFound();
  }

  const items = parseJson<
    { productId: string; name: string; qty: number; price: number }[]
  >(order.items, []);

  const paymentFailed =
    payment === "failed" || order.paymentStatus === "FAILED";

  return (
    <>
      <PaymentStatusRefresh paymentStatus={order.paymentStatus} />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {order.paymentStatus === "SUCCESS" ? (
          <div className="bg-emerald text-cream rounded-2xl p-8 text-center shadow-luxe mb-8">
            <p className="text-5xl mb-3">✦</p>

            <h1 className="font-serif text-3xl md:text-4xl mb-2">
              Payment Received
            </h1>

            <p className="text-cream/80">
              Your order <b>{order.id}</b> is confirmed and will arrive in{" "}
              <b>5–6 business days</b>.
            </p>

            <p className="text-gold-light text-sm mt-2">
              A confirmation email has been sent to {order.customerEmail}
            </p>
          </div>
        ) : paymentFailed ? (
          <div className="bg-maroon text-cream rounded-2xl p-8 text-center shadow-luxe mb-8">
            <h1 className="font-serif text-3xl mb-2">
              Payment Failed
            </h1>

            <p className="text-cream/80 mb-4">
              Your order was not placed. Don't worry — you can try again.
            </p>

            <Link href="/cart" className="btn-gold">
              Retry Payment
            </Link>
          </div>
        ) : (
          <h1 className="section-title">Order {order.id}</h1>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                STATUS_STYLES[order.orderStatus] ||
                "bg-emerald/10 text-emerald"
              }`}
            >
              {order.orderStatus}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.paymentStatus === "SUCCESS"
                  ? "bg-emerald/15 text-emerald"
                  : "bg-maroon/10 text-maroon"
              }`}
            >
              Payment {order.paymentStatus}
            </span>
          </div>

          <div>
            <h2 className="font-serif text-xl mb-3">Items</h2>

            <div className="space-y-2 text-sm">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex justify-between border-b border-emerald/5 pb-2"
                >
                  <span>
                    {it.name} × {it.qty}
                  </span>

                  <span>
                    {formatPKR(it.price * it.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-sm text-emerald/80">
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatPKR(order.deliveryFee)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg text-emerald pt-2 border-t border-emerald/10">
              <span>Total Paid</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>

          <div className="text-sm text-emerald/70">
            <p className="font-semibold text-emerald mb-1">
              Delivering to
            </p>

            <p>
              {order.customerName} · {order.customerPhone}
            </p>

            <p>
              {order.flatNo}, {order.buildingName}, {order.area},{" "}
              {order.city} — {order.zipCode}, Pakistan
            </p>

            {order.gatewayTransactionId && (
              <p className="mt-1 text-xs">
                Transaction Ref: {order.gatewayTransactionId}
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/account" className="btn-outline">
            View All Orders
          </Link>
        </div>
      </div>
    </>
  );
}