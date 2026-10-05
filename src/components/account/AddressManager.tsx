"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Address = { id: string; flatNo: string; buildingName: string; area: string; city: string; zipCode: string };

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const empty = { flatNo: "", buildingName: "", area: "", city: "", zipCode: "" };
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(empty); setShowForm(false);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Could not save address.");
    }
  }

  async function remove(id: string) {
    await fetch("/api/account/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm px-4 py-2">
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="space-y-3 mb-6 bg-cream rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Flat/House No" value={form.flatNo} onChange={(e) => setForm({ ...form, flatNo: e.target.value })} className="input-luxe" />
            <input required placeholder="Building/Street" value={form.buildingName} onChange={(e) => setForm({ ...form, buildingName: e.target.value })} className="input-luxe" />
            <input required placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input-luxe" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-luxe" />
          </div>
          <input required placeholder="Zip Code (5 digits)" maxLength={5} value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="input-luxe" />
          {msg && <p className="text-sm text-maroon">{msg}</p>}
          <button type="submit" className="btn-gold text-sm px-5 py-2">Save Address</button>
        </form>
      )}

      {addresses.length === 0 && !showForm && (
        <p className="text-emerald/60 text-sm">No saved addresses yet.</p>
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="border border-emerald/10 rounded-xl p-4 flex justify-between items-start gap-3">
            <div className="text-sm text-emerald/80">
              <p className="font-semibold text-emerald">{a.flatNo}, {a.buildingName}</p>
              <p>{a.area}, {a.city} — {a.zipCode}</p>
            </div>
            <button onClick={() => remove(a.id)} className="text-maroon text-xs hover:underline shrink-0">Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}