
// Re-export all functions from the separate modules
export * from './product-analytics';
export * from './products';
export * from './brevo';
export * from './pitch-deck';
export * from './utils/validation';

// Export function to send a test email
export const sendTestEmail = async () => {
  const { data, error } = await supabase.functions.invoke('send-test-email');
  if (error) throw error;
  return data;
};
