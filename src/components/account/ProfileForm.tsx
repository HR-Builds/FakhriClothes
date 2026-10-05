"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [form, setForm] = useState({ name, phone });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg("");
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg(res.ok ? "✓ Profile updated" : "Could not update profile.");
    if (res.ok) router.refresh();
  }

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card h-fit">
      <h2 className="font-serif text-2xl mb-6">Profile</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-luxe">Full Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxe" />
        </div>
        <div>
          <label className="label-luxe">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-luxe" />
        </div>
        <div>
          <label className="label-luxe">Email (cannot be changed)</label>
          <input value={email} readOnly className="input-luxe bg-emerald/5" />
        </div>
        <button type="submit" disabled={saving} className="btn-gold">{saving ? "Saving…" : "Save Changes"}</button>
        {msg && <p className="text-sm text-emerald">{msg}</p>}
      </form>
    </section>
  );
}