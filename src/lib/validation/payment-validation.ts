
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePaymentAmount = (amount: number): ValidationResult => {
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid amount'
    };
  }
  
  if (amount > 999999) {
    return {
      isValid: false,
      error: 'Amount exceeds maximum allowed'
    };
  }

  return { isValid: true };
};

export const validatePaymentReference = (referenceId: string): ValidationResult => {
  if (!referenceId || referenceId.trim().length === 0) {
    return {
      isValid: false,
      error: 'Invalid payment reference'
    };
  }

  return { isValid: true };
};
