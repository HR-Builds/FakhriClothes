"use client";

import { useState } from "react";
import { formatPKR } from "@/lib/utils";

const DELIVERY_FEE = Number(process.env.NEXT_PUBLIC_DELIVERY_FEE || 290);

type Item = {
  id: string;
  name: string;
  slug: string;
  price: number;
  qty: number;
};

type SavedAddress = {
  id: string;
  flatNo: string;
  buildingName: string;
  area: string;
  city: string;
  zipCode: string;
};

type Props = {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: Item[];
  savedAddresses: SavedAddress[];
};

export default function CheckoutClient({
  user,
  items,
  savedAddresses,
}: Props) {
  const [form, setForm] = useState({
    fullName: user.name,
    phone: user.phone,
    email: user.email,
    flatNo: "",
    buildingName: "",
    area: "",
    city: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [k]: e.target.value });
    };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const total = subtotal + DELIVERY_FEE;

  const addressComplete =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.flatNo.trim() &&
    form.buildingName.trim() &&
    form.area.trim() &&
    form.city.trim() &&
    /^\d{5}$/.test(form.zipCode);

  const canPlace = Boolean(addressComplete) && !placing;

  function fillAddress(address: SavedAddress) {
    setForm((current) => ({
      ...current,
      flatNo: address.flatNo,
      buildingName: address.buildingName,
      area: address.area,
      city: address.city,
      zipCode: address.zipCode,
    }));
  }

  async function placeOrder() {
    setPlacing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not place order.");
        setPlacing(false);
        return;
      }

      if (!data.redirectUrl) {
        setError("WhatsApp link was not returned.");
        setPlacing(false);
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError("Could not place order. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-10">
      <div className="lg:col-span-2 space-y-8">
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
          <h2 className="font-serif text-2xl mb-6">
            1 · Contact Details
          </h2>

          {error && (
            <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3 mb-4">
              {error}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-luxe">Full Name *</label>

              <input
                value={form.fullName}
                onChange={set("fullName")}
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">
                Email (from your account)
              </label>

              <input
                value={form.email}
                readOnly
                className="input-luxe bg-emerald/5"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label-luxe">Phone Number *</label>

            <input
              value={form.phone}
              onChange={set("phone")}
              placeholder="03XX XXXXXXX"
              className="input-luxe w-full"
            />

            <p className="text-xs text-emerald/50 mt-2">
              Your phone number is required for delivery contact.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
          <h2 className="font-serif text-2xl mb-6">
            2 · Delivery Address (Pakistan only)
          </h2>

          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <p className="label-luxe">Use a saved address</p>

              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => fillAddress(address)}
                    className="text-sm border border-emerald/20 rounded-full px-4 py-2 hover:border-gold hover:text-gold-dark transition-colors"
                  >
                    {address.flatNo}, {address.area}, {address.city}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-luxe">
                Flat / House / Shop Number *
              </label>

              <input
                value={form.flatNo}
                onChange={set("flatNo")}
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">
                Building Name / Street *
              </label>

              <input
                value={form.buildingName}
                onChange={set("buildingName")}
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">
                Area / Locality *
              </label>

              <input
                value={form.area}
                onChange={set("area")}
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">City *</label>

              <input
                value={form.city}
                onChange={set("city")}
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">
                Zip / Postal Code *
              </label>

              <input
                value={form.zipCode}
                onChange={set("zipCode")}
                maxLength={5}
                inputMode="numeric"
                placeholder="e.g. 54000"
                className="input-luxe"
              />
            </div>

            <div>
              <label className="label-luxe">Country</label>

              <input
                value="Pakistan"
                readOnly
                className="input-luxe bg-emerald/5"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
          <h2 className="font-serif text-2xl mb-4">
            3 · Order Confirmation
          </h2>

          <div className="border-2 border-gold bg-gold/5 rounded-xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center text-xl shrink-0">
              💬
            </div>

            <div>
              <p className="font-semibold text-lg">
                Continue on WhatsApp
              </p>

              <p className="text-sm text-emerald/60 mt-1">
                Continue your order directly with Fakhri Clothes on
                WhatsApp. Your order details will be prepared
                automatically.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div>
        <div className="bg-white rounded-2xl p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl mb-6">
            4 · Order Review
          </h2>

          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm gap-2"
              >
                <span className="text-emerald/80">
                  {item.name} × {item.qty}
                </span>

                <span className="whitespace-nowrap">
                  {formatPKR(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-emerald/10 pt-4 text-emerald/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery (flat)</span>
              <span>{formatPKR(DELIVERY_FEE)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg text-emerald pt-2 border-t border-emerald/10">
              <span>Grand Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={placeOrder}
            disabled={!canPlace}
            className="btn-gold w-full mt-6"
          >
            {placing
              ? "Opening WhatsApp..."
              : addressComplete
                ? "Continue on WhatsApp"
                : "Complete all address fields"}
          </button>

          <p className="text-xs text-emerald/50 mt-4 text-center">
            You'll be taken to WhatsApp with your order details ready
            to send.
          </p>
        </div>
      </div>
    </div>
  );
}