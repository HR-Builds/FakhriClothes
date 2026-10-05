import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DELIVERY_FEE } from "@/lib/constants";
import { formatPKR, parseJson } from "@/lib/utils";
import Link from "next/link";
import CartItemRow from "@/components/cart/CartItemRow";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getSessionUser();
  if (!user) return null; // middleware redirects to login

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <h1 className="section-title">Your Cart</h1>
      <span className="gold-underline" />

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-emerald/60 text-lg mb-6">Your cart is empty.</p>
          <Link href="/" className="btn-gold">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((i) => (
              <CartItemRow key={i.id} itemId={i.id} slug={i.product.slug} name={i.product.name}
                price={i.product.price} qty={i.qty} stockQty={i.product.stockQty}
                image={parseJson<string[]>(i.product.images, [])[0] || ""} />
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-card h-fit sticky top-24">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-emerald/80">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery (flat)</span><span>{formatPKR(DELIVERY_FEE)}</span></div>
              <div className="border-t border-emerald/10 pt-3 flex justify-between font-semibold text-lg text-emerald">
                <span>Total</span><span>{formatPKR(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-gold w-full mt-6">Proceed to Checkout</Link>
            <p className="text-xs text-emerald/50 mt-4 text-center">5–6 business days delivery, anywhere in Pakistan</p>
          </div>
        </div>
      )}
    </div>
  );
}