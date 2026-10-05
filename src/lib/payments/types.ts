export type CreatePaymentInput = {
  orderId: string;
  amount: number; // PKR
  customerName: string;
  customerEmail: string;
};

export type CreatePaymentResult = { redirectUrl: string };

export type VerifyResult = { transactionId: string; success: boolean };

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyCallback(params: Record<string, string>): Promise<VerifyResult>;
}