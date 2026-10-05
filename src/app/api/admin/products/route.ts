import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

function handle(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function GET() {
  try {
    await requireAdmin();
    const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ products });
  } catch (e) { return handle(e); }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name, collectionName, category, price, fabric, description, images, stockQty, featured } = await req.json();

    if (!name?.trim() || !collectionName?.trim() || !fabric?.trim()) {
      return NextResponse.json({ error: "Name, collection and fabric are required." }, { status: 400 });
    }
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: "Price must be a positive number." }, { status: 400 });
    }
    const imageList = String(images || "").split("\n").map((s: string) => s.trim()).filter(Boolean);

    // Unique slug
    let slug = slugify(name);
    if (await db.product.findUnique({ where: { slug } })) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const product = await db.product.create({
      data: {
        name: name.trim(),
        slug,
        collectionName: collectionName.trim(),
        category,
        price: Math.round(Number(price)),
        fabric: fabric.trim(),
        description: description || "",
        images: JSON.stringify(imageList),
        stockQty: Math.max(0, Math.round(Number(stockQty) || 0)),
        featured: !!featured,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) { return handle(e); }
}