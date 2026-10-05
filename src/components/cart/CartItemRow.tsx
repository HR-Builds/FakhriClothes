"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/CartContext";
import { formatPKR } from "@/lib/utils";

type Props = {
  itemId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stockQty: number;
};

export default function CartItemRow({ itemId, slug, name, price, image, qty, stockQty }: Props) {
  const [q, setQ] = useState(qty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const { refresh } = useCart();

  async function update(newQty: number) {
    if (saving) return;
    setMsg("");

    // Minus at qty 1 → remove the item entirely
    if (newQty < 1) { await remove(); return; }

    // Don't allow more than available stock
    if (newQty > stockQty) {
      setMsg(`Only ${stockQty} in stock`);
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: newQty }),
    });
    setSaving(false);

    if (res.ok) {
      setQ(newQty);
      await refresh();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Could not update quantity. Try again.");
    }
  }

  async function remove() {
    if (saving) return;
    setSaving(true);
    const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    setSaving(false);
    if (res.ok) {
      await refresh();
      router.refresh();
    } else {
      setMsg("Could not remove item. Try again.");
    }
  }

  return (
    <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-card items-center">
      <Link href={`/product/${slug}`} className="relative w-20 md:w-24 aspect-[4/5] rounded-lg overflow-hidden shrink-0 bg-emerald/5">
        {image && <Image src={image} alt={name} width={200} height={250} className="object-cover w-full h-full" />}
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/product/${slug}`} className="font-serif text-lg hover:text-gold-dark transition-colors block truncate">{name}</Link>
        <p className="text-emerald/60 text-sm">{formatPKR(price)} each</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-emerald/20 rounded-full">
            <button onClick={() => update(q - 1)} disabled={saving} className="px-3 py-1 hover:text-gold-dark disabled:opacity-40" aria-label="Decrease">−</button>
            <span className="w-7 text-center text-sm font-semibold">{q}</span>
            <button onClick={() => update(q + 1)} disabled={saving || q >= stockQty} className="px-3 py-1 hover:text-gold-dark disabled:opacity-40" aria-label="Increase">+</button>
          </div>
          <button onClick={remove} disabled={saving} className="text-maroon text-sm hover:underline disabled:opacity-40">
            {saving ? "Working…" : "Remove"}
          </button>
        </div>
        {msg && <p className="text-xs text-gold-dark mt-1">{msg}</p>}
      </div>
      <p className="font-semibold whitespace-nowrap">{formatPKR(price * q)}</p>
    </div>
  );
}