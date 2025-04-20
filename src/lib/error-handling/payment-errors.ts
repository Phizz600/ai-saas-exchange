
export type PaymentErrorType = 'validation' | 'processing' | 'authorization' | 'network';

export interface PaymentError {
  type: PaymentErrorType;
  message: string;
  details?: unknown;
}

export class PaymentProcessingError extends Error {
  constructor(
    public type: PaymentErrorType,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PaymentProcessingError';
  }
}

export const createPaymentError = (type: PaymentErrorType, message: string, details?: unknown): PaymentError => ({
  type,
  message,
  details,
});

