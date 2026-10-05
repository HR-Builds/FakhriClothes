import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

function handle(e: unknown) {
  if (e instanceof AuthError) {
    return NextResponse.json(
      { error: e.message },
      { status: e.status }
    );
  }

  console.error(e);

  return NextResponse.json(
    { error: "Server error" },
    { status: 500 }
  );
}

async function ownItem(id: string, userId: string) {
  const item = await db.cartItem.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!item || item.userId !== userId) {
    return null;
  }

  return item;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const { qty } = await req.json();

    const item = await ownItem(id, user.id);

    if (!item) {
      return NextResponse.json(
        { error: "Item not found." },
        { status: 404 }
      );
    }

    const q = Math.max(
      1,
      Math.min(Number(qty) || 1, item.product.stockQty)
    );

    const updated = await db.cartItem.update({
      where: { id: item.id },
      data: { qty: q },
    });

    return NextResponse.json({ item: updated });
  } catch (e) {
    return handle(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const item = await ownItem(id, user.id);

    if (!item) {
      return NextResponse.json(
        { error: "Item not found." },
        { status: 404 }
      );
    }

    await db.cartItem.delete({
      where: { id: item.id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handle(e);
  }
}