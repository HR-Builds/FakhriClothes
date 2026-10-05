import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// This page simulates the BANK's secure payment interface in dev/testing.
// With real Safepay credentials, customers get redirected to the real gateway
// instead — this page becomes unused automatically.
export default async function MockPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ tx?: string }>;
}) {
  const { orderId } = await params;
  const { tx: searchTx } = await searchParams;

  const user = await getSessionUser();

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: user?.id || "",
    },
  });

  if (!order) {
    notFound();
  }

  const tx = searchTx || order.gatewayTransactionId || "";

  const successUrl = `/api/payments/callback?tx=${encodeURIComponent(
    tx
  )}&orderId=${order.id}&status=success`;

  const failUrl = `/api/payments/callback?tx=${encodeURIComponent(
    tx
  )}&orderId=${order.id}&status=failed`;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow-luxe p-8 text-center">
        <p className="text-gold-dark uppercase tracking-[0.3em] text-xs mb-2">
          Mock Bank Gateway (test mode)
        </p>

        <h1 className="font-serif text-2xl mb-2">
          Fakhri Clothes Payment
        </h1>

        <p className="text-emerald/60 text-sm mb-1">
          Transaction: {tx}
        </p>

        <p className="text-3xl font-semibold my-6">
          {formatPKR(order.total)}
        </p>

        <div className="space-y-3">
          <a href={successUrl} className="btn-gold w-full">
            Pay {formatPKR(order.total)} ✓
          </a>

          <a
            href={failUrl}
            className="btn-outline w-full border-maroon text-maroon hover:bg-maroon hover:text-cream"
          >
            Simulate Failed Payment
          </a>
        </div>

        <p className="text-xs text-emerald/40 mt-6">
          With live Safepay keys, customers never see this page — the real
          bank gateway handles it.
        </p>
      </div>
    </div>
  );
}
