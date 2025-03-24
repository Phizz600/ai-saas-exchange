
// Re-export all functions from the separate modules
export * from './product-analytics';
export * from './products';
export * from './brevo';
export * from './pitch-deck';
export * from './utils/validation';

import { supabase } from './client';

// Export function to send a test email
export const sendTestEmail = async () => {
  console.log("Invoking send-test-email edge function...");
  try {
    const { data, error } = await supabase.functions.invoke('send-test-email');
    
    if (error) {
      console.error("Error from edge function:", error);
      throw error;
    }
    
    console.log("Edge function response:", data);
    return data;
  } catch (err) {
    console.error("Error sending test email:", err);
    throw err;
  }
};
