import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

function handle(e: unknown) {
  if (e instanceof AuthError) {
    return NextResponse.json(
      { error: e.message },
      { status: e.status }
    );
  }

  return NextResponse.json(
    { error: "Server error" },
    { status: 500 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    const existing = await db.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const imageList = String(body.images || "")
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name?.trim() || existing.name,
        collectionName:
          body.collectionName?.trim() || existing.collectionName,
        category: body.category || existing.category,
        price: Math.round(Number(body.price)) || existing.price,
        fabric: body.fabric?.trim() || existing.fabric,
        description: body.description ?? existing.description,
        images: JSON.stringify(imageList),
        stockQty: Math.max(
          0,
          Math.round(Number(body.stockQty ?? existing.stockQty))
        ),
        featured: !!body.featured,
      },
    });

    return NextResponse.json({ product });
  } catch (e) {
    return handle(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await db.product.delete({
      where: { id },
    }); // cart items & reviews cascade automatically

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handle(e);
  }
}