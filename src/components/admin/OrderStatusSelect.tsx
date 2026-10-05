"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderStatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const [status, setStatus] = useState(current);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function update(value: string) {
    setStatus(value); setSaved(false);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: value }),
    });
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <select value={status} onChange={(e) => update(e.target.value)} className="admin-input w-auto">
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {saved && <span className="text-emerald text-xs">✓ Saved</span>}
    </div>
  );
}