"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function remove() {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!confirming) {
    return <button onClick={() => setConfirming(true)} className="text-maroon hover:underline">Delete</button>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={remove} className="bg-maroon text-cream text-xs px-2 py-1 rounded">Confirm</button>
      <button onClick={() => setConfirming(false)} className="text-emerald/60 text-xs">Cancel</button>
    </span>
  );
}