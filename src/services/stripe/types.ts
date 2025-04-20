
export interface PaymentAuthorizationResponse {
  clientSecret: string | null;
  paymentIntentId: string | null;
  error: string | null;
}

export interface PaymentVerificationResponse {
  status: string | null;
  success: boolean;
  error: string | null;
  amount?: number;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  error: string | null;
}
