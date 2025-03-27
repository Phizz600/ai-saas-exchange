
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
    // Include timing information for debugging
    const startTime = performance.now();
    
    const { data, error } = await supabase.functions.invoke('send-test-email', {
      // Add some additional debugging info to track request
      body: { 
        timestamp: new Date().toISOString(), 
        debug: true,
        client_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform
        }
      }
    });
    
    const endTime = performance.now();
    console.log(`Edge function call took ${endTime - startTime}ms`);
    
    if (error) {
      console.error("Error from edge function:", error);
      throw error;
    }
    
    // Check for errors in the response data
    if (data?.error) {
      console.error("Error response from edge function:", data.error);
      throw new Error(data.error);
    }
    
    console.log("Edge function response:", data);
    return data;
  } catch (err) {
    console.error("Error sending test email:", err);
    
    // Provide more specific error messages based on error type
    if (err instanceof TypeError && err.message.includes('NetworkError')) {
      throw new Error('Network error connecting to the Edge Function. Check your connection and CORS settings.');
    }
    
    if (err.message?.includes('Failed to fetch')) {
      throw new Error('Failed to reach the Edge Function. Ensure it is deployed properly and accessible.');
    }
    
    throw err;
  }
};

// Function to schedule a welcome email to be sent after a delay - DISABLED
export const scheduleWelcomeEmail = async (
  email: string, 
  firstName: string, 
  userType: 'ai_builder' | 'ai_investor',
  siteUrl?: string
) => {
  console.log(`Welcome email functionality is currently disabled.`);
  return { 
    message: "Welcome email functionality is currently disabled", 
    status: "disabled" 
  };
};

// Function to send a welcome email directly - DISABLED
export const sendWelcomeEmail = async (
  email: string, 
  firstName: string, 
  userType: 'ai_builder' | 'ai_investor',
  siteUrl?: string
) => {
  console.log(`Welcome email functionality is currently disabled.`);
  return { 
    message: "Welcome email functionality is currently disabled", 
    status: "disabled" 
  };
};
