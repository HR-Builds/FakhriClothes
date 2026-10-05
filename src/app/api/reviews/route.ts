import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

function handle(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const reviews = await db.review.findMany({
    where: { productId, approved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { productId, rating, comment } = await req.json();
    const r = Number(rating);
    if (!productId || !comment || isNaN(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: "Rating (1–5) and comment are required." }, { status: 400 });
    }
    await db.review.create({
      data: { productId, userId: user.id, rating: r, comment, approved: false },
    });
    return NextResponse.json({ message: "Review submitted for approval." }, { status: 201 });
  } catch (e) { return handle(e); }
}