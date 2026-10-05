"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/store/CartContext";

export default function AddToCartButton({ productId, stockQty }: { productId: string; stockQty: number }) {
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { refresh } = useCart();

  const out = stockQty <= 0;

  async function add() {
    setState("loading");
    setMsg("");
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    // PRD §3: login required to add to cart → send to login, return here after
    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname)}&message=${encodeURIComponent("Please log in to add items to your cart.")}`);
      return;
    }
    const data = await res.json();
    if (res.ok) {
      setState("added");
      setMsg("Added to cart ✓");
      refresh();
    } else {
      setState("error");
      setMsg(data.error || "Could not add to cart.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-emerald/20 rounded-full">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg hover:text-gold-dark" aria-label="Decrease">−</button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty(Math.min(stockQty, qty + 1))} className="px-4 py-2 text-lg hover:text-gold-dark" aria-label="Increase">+</button>
        </div>
        <button onClick={add} disabled={out || state === "loading"} className="btn-gold flex-1">
          {out ? "Out of Stock" : state === "loading" ? "Adding…" : "Add to Cart"}
        </button>
      </div>
      {msg && <p className={`text-sm ${state === "added" ? "text-emerald" : "text-maroon"}`}>{msg}</p>}
    </div>
  );
}