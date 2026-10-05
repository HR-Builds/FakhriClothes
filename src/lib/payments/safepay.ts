import { Safepay } from "@sfpy/node-sdk";
import { Environment } from "@sfpy/node-sdk/dist/utils";
import { db } from "@/lib/db";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  VerifyResult,
} from "./types";

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

export const safepayProvider: PaymentProvider = {
  async createPayment({
    orderId,
    amount,
  }: CreatePaymentInput): Promise<CreatePaymentResult> {
    const safepay = getSafepay();

    const payment = await safepay.payments.create({
      amount: amount * 100,
      currency: "PKR",
    });

    if (!payment?.token) {
      throw new Error("Safepay did not return a payment token");
    }

    const redirectUrl = safepay.checkout.create({
      token: payment.token,
      orderId,
      cancelUrl: `${process.env.APP_URL}/orders/${orderId}?payment=cancelled`,
      redirectUrl: `${process.env.APP_URL}/api/payments/callback`,
      source: "custom",
      webhooks: true,
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        gatewayTransactionId: payment.token,
        paymentStatus: "PENDING",
      },
    });

    return { redirectUrl };
  },

  async verifyCallback(
    params: Record<string, string>
  ): Promise<VerifyResult> {
    const transactionId =
      params.tracker ||
      params.token ||
      params.order_id ||
      "";

    const status = (
      params.status ||
      params.state ||
      params.payment_status ||
      ""
    ).toLowerCase();

    const success =
      status === "success" ||
      status === "paid" ||
      status === "completed";

    return {
      transactionId,
      success,
    };
  },
};
