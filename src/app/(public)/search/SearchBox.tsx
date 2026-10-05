"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(q)}`); }}
      className="flex gap-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, collections…"
        className="input-luxe flex-1" />
      <button type="submit" className="btn-gold">Search</button>
    </form>
  );
}