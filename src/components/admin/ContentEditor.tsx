"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Banner = {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
};

type ProductOption = {
  id: string;
  name: string;
  collectionName: string;
};

export default function ContentEditor({
  banners: initialBanners,
  featuredIds,
  storyTitle,
  storyText,
  products,
}: {
  banners: Banner[];
  featuredIds: string[];
  storyTitle: string;
  storyText: string;
  products: ProductOption[];
}) {
  const [banners, setBanners] = useState<Banner[]>(
    initialBanners.length
      ? initialBanners
      : [
          {
            title: "",
            subtitle: "",
            image: "",
            cta: "/category/shirts",
          },
        ]
  );

  const [featured, setFeatured] = useState<string[]>(featuredIds);

  const [story, setStory] = useState({
    title: storyTitle,
    text: storyText,
  });

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  const router = useRouter();

  function updateBanner(
    i: number,
    field: keyof Banner,
    value: string
  ) {
    const next = [...banners];

    next[i] = {
      ...next[i],
      [field]: value,
    };

    setBanners(next);
  }

  function toggleFeatured(id: string) {
    setFeatured((f) =>
      f.includes(id)
        ? f.filter((x) => x !== id)
        : [...f, id]
    );
  }

  async function uploadImage(
    i: number,
    file: File
  ) {
    setUploading(i);
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

      updateBanner(i, "image", data.url);

      setMsg("✓ Image uploaded. Now click Save Homepage.");
    } catch (error) {
      console.error("Image upload error:", error);
      setMsg("Image upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          banners,
          featuredIds: featured,
          storyTitle: story.title,
          storyText: story.text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Could not save.");
        return;
      }

      setMsg("✓ Homepage updated! Changes are saved.");

      router.refresh();
    } catch (error) {
      console.error("Save homepage error:", error);
      setMsg("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <section className="bg-white rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">
            Hero Banners
          </h2>

          <button
            type="button"
            onClick={() =>
              setBanners([
                ...banners,
                {
                  title: "",
                  subtitle: "",
                  image: "",
                  cta: "/category/shirts",
                },
              ])
            }
            className="btn-outline text-sm px-4 py-2"
          >
            + Add Banner
          </button>
        </div>

        {banners.map((b, i) => (
          <div
            key={i}
            className="border border-emerald/10 rounded-xl p-4 space-y-4 bg-cream/50"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Title"
                value={b.title}
                onChange={(e) =>
                  updateBanner(i, "title", e.target.value)
                }
                className="admin-input"
              />

              <input
                placeholder="CTA link e.g. /category/three-piece"
                value={b.cta}
                onChange={(e) =>
                  updateBanner(i, "cta", e.target.value)
                }
                className="admin-input"
              />
            </div>

            <input
              placeholder="Subtitle"
              value={b.subtitle}
              onChange={(e) =>
                updateBanner(i, "subtitle", e.target.value)
              }
              className="admin-input"
            />

            {/* IMAGE UPLOAD */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Hero Image
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <label
                  className={`btn-outline text-sm px-4 py-2 cursor-pointer ${
                    uploading === i
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  {uploading === i
                    ? "Uploading..."
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading === i}
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        uploadImage(i, file);
                      }

                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                <span className="text-xs text-emerald/50">
                  JPG, PNG, WEBP or GIF · Max 5 MB
                </span>
              </div>

              <input
                placeholder="Or paste Image URL"
                value={b.image}
                onChange={(e) =>
                  updateBanner(i, "image", e.target.value)
                }
                className="admin-input w-full"
              />

              {b.image && (
                <div className="relative overflow-hidden rounded-xl border border-emerald/10 bg-cream">
                  <img
                    src={b.image}
                    alt={b.title || "Hero preview"}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {banners.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setBanners(
                    banners.filter((_, x) => x !== i)
                  )
                }
                className="text-maroon text-sm hover:underline"
              >
                Remove Banner
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="font-serif text-xl mb-4">
          Featured Products (homepage)
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
          {products.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2 text-sm border border-emerald/10 rounded-lg px-3 py-2 cursor-pointer hover:border-gold"
            >
              <input
                type="checkbox"
                checked={featured.includes(p.id)}
                onChange={() => toggleFeatured(p.id)}
                className="accent-gold"
              />

              <span className="truncate">
                {p.name}{" "}
                <span className="text-emerald/40">
                  · {p.collectionName}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-serif text-xl">
          Brand Story
        </h2>

        <input
          placeholder="Story title"
          value={story.title}
          onChange={(e) =>
            setStory({
              ...story,
              title: e.target.value,
            })
          }
          className="admin-input"
        />

        <textarea
          rows={4}
          placeholder="Story text"
          value={story.text}
          onChange={(e) =>
            setStory({
              ...story,
              text: e.target.value,
            })
          }
          className="admin-input resize-none"
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={saving || uploading !== null}
            className="btn-gold"
          >
            {saving ? "Saving..." : "Save Homepage"}
          </button>

          {msg && (
            <p className="text-sm text-emerald">
              {msg}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}