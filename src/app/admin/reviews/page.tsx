import { db } from "@/lib/db";
import ReviewToggle from "@/components/admin/ReviewToggle";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const reviews = await db.review.findMany({
    include: { product: { select: { name: true } }, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Reviews</h1>
      {reviews.length === 0 ? (
        <p className="bg-white rounded-2xl p-8 shadow-card text-center text-emerald/50">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold">
                  {r.product.name} <span className="text-gold ml-2">{"★".repeat(r.rating)}</span>
                </p>
                <p className="text-xs text-emerald/50">{r.user.name} · {r.user.email}</p>
                <p className="text-sm text-emerald/80 mt-1">{r.comment}</p>
              </div>
              <ReviewToggle id={r.id} approved={r.approved} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}