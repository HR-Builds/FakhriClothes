import crypto from "crypto";
import { db } from "@/lib/db";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider, VerifyResult } from "./types";

// Simulates a real bank gateway: creates a transaction ID, sends the customer
// to a secure payment page, then calls back with success/failure — exactly
// like Safepay/PayFast will.
export const mockProvider: PaymentProvider = {
  async createPayment({ orderId }: CreatePaymentInput): Promise<CreatePaymentResult> {
    const transactionId = "MOCK-" + crypto.randomBytes(8).toString("hex").toUpperCase();
    await db.order.update({
      where: { id: orderId },
      data: { gatewayTransactionId: transactionId, paymentStatus: "PENDING" },
    });
    return { redirectUrl: `/pay/${orderId}?tx=${transactionId}` };
  },

  async verifyCallback(params): Promise<VerifyResult> {
    const { tx, status } = params;
    const order = await db.order.findFirst({ where: { gatewayTransactionId: tx } });
    if (!order) return { transactionId: tx || "unknown", success: false };
    return { transactionId: tx, success: status === "success" };
  },
};