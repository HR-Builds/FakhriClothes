"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Review = { id: string; rating: number; comment: string; createdAt: string; userName: string };

export default function ReviewsSection({ productId, reviews, loggedIn }: { productId: string; reviews: Review[]; loggedIn: boolean }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname)}&message=${encodeURIComponent("Please log in to write a review.")}`);
      return;
    }
    setState(res.ok ? "done" : "error");
    setMsg(res.ok ? "Review submitted — it will appear after approval." : "Failed to submit review.");
    if (res.ok) setComment("");
  }

  return (
    <section className="mt-16 max-w-3xl">
      <h2 className="font-serif text-2xl md:text-3xl mb-6">Reviews</h2>

      {reviews.length === 0 && <p className="text-emerald/60 mb-8">No reviews yet — be the first!</p>}

      <div className="space-y-4 mb-10">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{r.userName}</p>
              <p className="text-gold">{"★".repeat(r.rating)}<span className="text-emerald/20">{"★".repeat(5 - r.rating)}</span></p>
            </div>
            <p className="text-emerald/80">{r.comment}</p>
          </div>
        ))}
      </div>

      <h3 className="font-serif text-xl mb-4">Write a review</h3>
      {!loggedIn && <p className="text-emerald/60 mb-4">Please log in to write a review.</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-luxe">Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-luxe" disabled={!loggedIn}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxe">Your review</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={4}
            className="input-luxe resize-none" placeholder="Share your experience…" disabled={!loggedIn} />
        </div>
        <button type="submit" className="btn-outline" disabled={!loggedIn || state === "loading"}>
          {state === "loading" ? "Submitting…" : "Submit Review"}
        </button>
        {msg && <p className={`text-sm ${state === "done" ? "text-emerald" : "text-maroon"}`}>{msg}</p>}
      </form>
    </section>
  );
}