import { NextRequest, NextResponse } from "next/server";
import { Safepay } from "@sfpy/node-sdk";
import { Environment } from "@sfpy/node-sdk/dist/utils";
import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import {
  sendOrderConfirmationEmail,
  sendNewOrderAdminEmail,
} from "@/lib/email";

function getSafepay() {
  const apiKey = process.env.SAFEPAY_API_KEY;
  const v1Secret = process.env.SAFEPAY_SECRET;
  const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET || "";

  if (!apiKey) {
    throw new Error("SAFEPAY_API_KEY is missing");
  }

  if (!v1Secret) {
    throw new Error("SAFEPAY_SECRET is missing");
  }

  const environment =
    process.env.SAFEPAY_ENVIRONMENT === "sandbox"
      ? Environment.Sandbox
      : process.env.SAFEPAY_ENVIRONMENT === "development"
        ? Environment.Development
        : Environment.Production;

  return new Safepay({
    environment,
    apiKey,
    v1Secret,
    webhookSecret,
  });
}

async function markOrderPaid(
  orderId: string,
  transactionId: string
) {
  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return false;
  }

  if (order.paymentStatus === "SUCCESS") {
    return true;
  }

  const items = parseJson<
    { productId: string; qty: number }[]
  >(order.items, []);

  for (const item of items) {
    await db.product
      .update({
        where: { id: item.productId },
        data: {
          stockQty: {
            decrement: item.qty,
          },
        },
      })
      .catch(() => {});
  }

  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "SUCCESS",
      orderStatus: "PROCESSING",
      gatewayTransactionId:
        transactionId || order.gatewayTransactionId,
    },
  });

  await db.cartItem.deleteMany({
    where: {
      userId: order.userId,
    },
  });

await sendOrderConfirmationEmail(
  order.customerEmail,
  order.customerName,
  order.id,
  order.total
).catch(() => {});

await sendNewOrderAdminEmail(
  order.id,
  order.customerName,
  order.customerEmail,
  order.total
).catch((error) => {
  console.error(
    "Admin order notification failed:",
    error
  );
});

return true;
}
/**
 * Customer redirect after Safepay checkout.
 */
export async function GET(req: NextRequest) {
  const orderId =
    req.nextUrl.searchParams.get("orderId") ||
    req.nextUrl.searchParams.get("order_id") ||
    "";

  if (!orderId) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/`
    );
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/`
    );
  }

  const base =
    `${process.env.APP_URL}/orders/${order.id}`;

  if (order.paymentStatus === "SUCCESS") {
    return NextResponse.redirect(
      `${base}?payment=success`
    );
  }

  return NextResponse.redirect(
    `${base}?payment=processing`
  );
}

/**
 * Safepay webhook.
 */
export async function POST(req: NextRequest) {
  try {
    const safepay = getSafepay();

    const body = await req.json();

    const headers = {
      "x-sfpy-signature":
        req.headers.get("x-sfpy-signature") || "",
    };

    if (!headers["x-sfpy-signature"]) {
      console.error(
        "Safepay webhook: missing X-SFPY-SIGNATURE header"
      );

      return NextResponse.json(
        {
          error:
            "Missing Safepay webhook signature",
        },
        { status: 401 }
      );
    }

    const valid = safepay.verify.webhook({
      body,
      headers,
    });

    if (!valid) {
      console.error(
        "Safepay webhook: invalid signature"
      );

      return NextResponse.json(
        {
          error:
            "Invalid Safepay webhook signature",
        },
        { status: 401 }
      );
    }

    console.log(
      "Safepay webhook received:",
      JSON.stringify(body, null, 2)
    );

    const data = body?.data || {};

    const notification =
      data?.notification ||
      body?.notification ||
      {};

    const paymentMetadata =
      notification?.payment_metadata ||
      data?.payment_metadata ||
      body?.payment_metadata ||
      [];

    let metadataOrderId = "";

    if (Array.isArray(paymentMetadata)) {
      const orderMeta = paymentMetadata.find(
        (item: any) =>
          item?.meta_key === "order_id"
      );

      metadataOrderId =
        orderMeta?.meta_value || "";
    }

    const metadata =
      notification?.metadata ||
      data?.metadata ||
      body?.metadata ||
      {};

    const orderId =
      metadata?.order_id ||
      metadataOrderId ||
      notification?.order_id ||
      data?.order_id ||
      body?.orderId ||
      body?.order_id ||
      "";

    const tracker =
      notification?.tracker ||
      data?.tracker ||
      body?.tracker ||
      "";

    const state = String(
      notification?.state ||
        data?.state ||
        body?.state ||
        ""
    ).toUpperCase();

    console.log(
      "Safepay webhook parsed:",
      {
        orderId,
        tracker,
        state,
      }
    );

    if (!tracker && !orderId) {
      console.error(
        "Safepay webhook: missing transaction reference"
      );

      return NextResponse.json(
        {
          error:
            "Missing Safepay transaction reference",
        },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: {
        OR: [
          ...(orderId
            ? [{ id: String(orderId) }]
            : []),
          ...(tracker
            ? [
                {
                  gatewayTransactionId:
                    String(tracker),
                },
              ]
            : []),
        ],
      },
    });

    if (!order) {
      console.error(
        "Safepay webhook: order not found",
        {
          orderId,
          tracker,
        }
      );

      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    if (state === "PAID") {
      await markOrderPaid(
        order.id,
        String(
          tracker ||
            order.gatewayTransactionId ||
            ""
        )
      );

      console.log(
        `Safepay payment marked SUCCESS for order ${order.id}`
      );
    } else {
      console.log(
        `Safepay webhook received with state: ${state}`
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Safepay webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
