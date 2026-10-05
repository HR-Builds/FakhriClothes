
import { mockProvider } from "./mock";
import { safepayProvider } from "./safepay";
import type { PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  return process.env.PAYMENT_PROVIDER === "safepay"
    ? safepayProvider
    : mockProvider;
}