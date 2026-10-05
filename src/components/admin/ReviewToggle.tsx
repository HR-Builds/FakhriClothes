"use client";
import { useRouter } from "next/navigation";

export default function ReviewToggle({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !approved }),
    });
    router.refresh();
  }

  return (
    <button onClick={toggle}
      className={`text-sm px-4 py-2 rounded-full font-semibold ${approved ? "bg-maroon/10 text-maroon hover:bg-maroon/20" : "bg-emerald/15 text-emerald hover:bg-emerald/25"}`}>
      {approved ? "Hide" : "Approve"}
    </button>
  );
}