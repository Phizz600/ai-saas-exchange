
export const hasValue = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && Object.keys(value).length === 0) return false;
  return true;
};

// Checks if a number has a real value (not zero)
export const hasNumberValue = (value: number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (value === 0) return false;
  return true;
};
