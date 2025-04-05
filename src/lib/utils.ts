export function formatCurrency(value: number | null | undefined): string {
  // Ensure value is a number or defaults to 0
  const numericValue = (value === null || value === undefined) ? 0 : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericValue);
}
