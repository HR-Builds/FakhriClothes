import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

function handle(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function GET() {
  try {
    const user = await requireUser();
    const items = await db.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { id: "desc" },
    });
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    return NextResponse.json({ items, subtotal });
  } catch (e) { return handle(e); }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { productId, qty = 1 } = await req.json();
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (product.stockQty <= 0) return NextResponse.json({ error: "This item is out of stock." }, { status: 400 });

    const existing = await db.cartItem.findFirst({ where: { userId: user.id, productId } });
    const newQty = (existing?.qty || 0) + qty;
    if (newQty > product.stockQty) {
      return NextResponse.json({ error: `Only ${product.stockQty} in stock.` }, { status: 400 });
    }
    const item = existing
      ? await db.cartItem.update({ where: { id: existing.id }, data: { qty: newQty } })
      : await db.cartItem.create({ data: { userId: user.id, productId, qty } });
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) { return handle(e); }
}