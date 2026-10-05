import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";
import { DELIVERY_FEE } from "@/lib/constants";
import { isValidPKPhone, normalizePhone } from "@/lib/utils";

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

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const body = await req.json();

    const {
      fullName,
      phone,
      flatNo,
      buildingName,
      area,
      city,
      zipCode,
    } = body;

    const missing: string[] = [];

    if (!fullName?.trim()) missing.push("full name");
    if (!phone?.trim()) missing.push("phone number");
    if (!flatNo?.trim()) missing.push("flat/house number");
    if (!buildingName?.trim()) missing.push("building/street");
    if (!area?.trim()) missing.push("area/locality");
    if (!city?.trim()) missing.push("city");
    if (!zipCode?.trim()) missing.push("zip code");

    if (missing.length) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    if (!isValidPKPhone(normalizedPhone)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid Pakistani phone number (03XXXXXXXXX).",
        },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(zipCode.trim())) {
      return NextResponse.json(
        {
          error: "Zip code must be 5 digits.",
        },
        { status: 400 }
      );
    }

    const cart = await db.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    for (const item of cart) {
      if (item.product.stockQty < item.qty) {
        return NextResponse.json(
          {
            error: `"${item.product.name}" has only ${item.product.stockQty} left in stock.`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );

    const total = subtotal + DELIVERY_FEE;

    const order = await db.order.create({
      data: {
        userId: user.id,
        customerName: fullName.trim(),
        customerEmail: user.email,
        customerPhone: normalizedPhone,

        flatNo: flatNo.trim(),
        buildingName: buildingName.trim(),
        area: area.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),

        items: JSON.stringify(
          cart.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            qty: item.qty,
            price: item.product.price,
          }))
        ),

        deliveryFee: DELIVERY_FEE,
        total,

        paymentMethod: "whatsapp",
        paymentStatus: "PENDING",
        phoneVerifiedForOrder: false,
      },
    });

    await db.address
      .create({
        data: {
          userId: user.id,
          flatNo: flatNo.trim(),
          buildingName: buildingName.trim(),
          area: area.trim(),
          city: city.trim(),
          zipCode: zipCode.trim(),
        },
      })
      .catch(() => {});

    const whatsappNumber =
      process.env.NEXT_PUBLIC_OWNER_PHONE ||
      "923213611921";

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.product.name} x${item.qty} — PKR ${(item.product.price * item.qty).toLocaleString()}`
      )
      .join("\n");

    const message = [
      "Assalam o Alaikum, I want to place an order from Fakhri Clothes.",
      "",
      `Order ID: ${order.id}`,
      `Name: ${fullName.trim()}`,
      `Phone: ${normalizedPhone}`,
      "",
      "Order Items:",
      itemsText,
      "",
      `Subtotal: PKR ${subtotal.toLocaleString()}`,
      `Delivery: PKR ${DELIVERY_FEE.toLocaleString()}`,
      `Total: PKR ${total.toLocaleString()}`,
      "",
      "Delivery Address:",
      `${flatNo.trim()}, ${buildingName.trim()}`,
      `${area.trim()}, ${city.trim()} - ${zipCode.trim()}`,
      "",
      "Please confirm my order. Thank you!",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    return NextResponse.json({
      redirectUrl: whatsappUrl,
      orderId: order.id,
    });
  } catch (e) {
    return handle(e);
  }
}