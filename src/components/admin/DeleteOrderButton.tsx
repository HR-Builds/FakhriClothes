"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function remove() {
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!confirming) {
    return <button onClick={() => setConfirming(true)} className="text-maroon text-sm hover:underline">Delete Order</button>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={remove} className="bg-maroon text-cream text-xs px-2 py-1 rounded">Confirm</button>
      <button onClick={() => setConfirming(false)} className="text-emerald/60 text-xs">Cancel</button>
    </span>
  );
}