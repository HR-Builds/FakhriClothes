import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

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
    const { orderStatus } = await req.json();

    if (!["PROCESSING", "SHIPPED", "DELIVERED"].includes(orderStatus)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: { id },
      data: {
        orderStatus,
        ...(orderStatus === "SHIPPED"
          ? { shippedAt: new Date() }
          : {}),
        ...(orderStatus === "DELIVERED"
          ? { deliveredAt: new Date() }
          : {}),
      },
    });

    return NextResponse.json({ order });
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

    await db.order.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handle(e);
  }
}