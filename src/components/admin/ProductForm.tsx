"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

type Initial = {
  id: string;
  name: string;
  collectionName: string;
  category: string;
  price: number;
  fabric: string;
  description: string;
  images: string;
  stockQty: number;
  featured: boolean;
};

export default function ProductForm({ product }: { product?: Initial }) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    collectionName: product?.collectionName || "",
    category: product?.category || "shirts",
    price: product?.price || 0,
    fabric: product?.fabric || "",
    description: product?.description || "",
    images: product?.images || "",
    stockQty: product?.stockQty ?? 0,
    featured: product?.featured || false,
  });

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  async function uploadImage(file: File) {
    setUploading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Image upload failed.");
        return;
      }

      setForm((current) => ({
        ...current,
        images: current.images
          ? `${current.images}\n${data.url}`
          : data.url,
      }));
    } catch {
      setMsg("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadImage(file);

    // Allow selecting the same file again later.
    e.target.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMsg("");

    const payload = {
      ...form,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
    };

    const res = await fetch(
      isEdit
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    setSaving(false);

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setMsg(data.error || "Could not save product.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-card max-w-3xl space-y-5"
    >
      {msg && (
        <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3">
          {msg}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-luxe">Product Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="admin-input"
          />
        </div>

        <div>
          <label className="label-luxe">Collection / Brand *</label>
          <input
            required
            value={form.collectionName}
            onChange={(e) =>
              setForm({
                ...form,
                collectionName: e.target.value,
              })
            }
            className="admin-input"
            placeholder="e.g. Zeenat"
          />
        </div>

        <div>
          <label className="label-luxe">Category *</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="admin-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-luxe">Price (PKR) *</label>
          <input
            required
            type="number"
            min={1}
            value={form.price || ""}
            onChange={(e) =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
            className="admin-input"
          />
        </div>

        <div>
          <label className="label-luxe">Fabric *</label>
          <input
            required
            value={form.fabric}
            onChange={(e) =>
              setForm({
                ...form,
                fabric: e.target.value,
              })
            }
            className="admin-input"
            placeholder="e.g. Premium Lawn"
          />
        </div>

        <div>
          <label className="label-luxe">Stock Quantity *</label>
          <input
            required
            type="number"
            min={0}
            value={form.stockQty}
            onChange={(e) =>
              setForm({
                ...form,
                stockQty: Number(e.target.value),
              })
            }
            className="admin-input"
          />
          <p className="text-xs text-emerald/50 mt-1">
            0 = shows Out of Stock automatically
          </p>
        </div>
      </div>

      <div>
        <label className="label-luxe">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="admin-input resize-none"
        />
      </div>

      <div>
        <label className="label-luxe">
          Product Images
        </label>

        <div className="border border-emerald/15 rounded-xl p-4 space-y-4">
          <div>
            <label
              htmlFor="product-image"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-emerald text-cream cursor-pointer hover:opacity-90 transition"
            >
              {uploading ? "Uploading..." : "Choose Image"}
            </label>

            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />

            <p className="text-xs text-emerald/50 mt-2">
              JPG, PNG, WEBP or GIF • Maximum 5 MB
            </p>
          </div>

          <textarea
            rows={4}
            value={form.images}
            onChange={(e) =>
              setForm({
                ...form,
                images: e.target.value,
              })
            }
            className="admin-input resize-none"
            placeholder="/uploads/product-image.jpg"
          />

          {form.images && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images
                .split("\n")
                .map((url) => url.trim())
                .filter(Boolean)
                .map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="border rounded-xl overflow-hidden bg-cream"
                  >
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full aspect-[4/5] object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) =>
            setForm({
              ...form,
              featured: e.target.checked,
            })
          }
          className="accent-gold w-5 h-5"
        />

        <span className="text-sm font-medium">
          Show on homepage (Featured / New Arrivals)
        </span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-gold"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Product"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}