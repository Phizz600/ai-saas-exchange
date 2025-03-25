
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

// Function to send a welcome email directly (can be used during signup)
export const sendWelcomeEmail = async (email: string, firstName: string, userType: 'ai_builder' | 'ai_investor') => {
  console.log(`Sending welcome email to ${email}`);
  try {
    const startTime = performance.now();
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: { 
        email,
        firstName,
        userType
      }
    });
    
    const endTime = performance.now();
    console.log(`Welcome email function call took ${endTime - startTime}ms`);
    
    if (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
    
    // Check for errors in the response data
    if (data?.error) {
      console.error("Error in welcome email response:", data.error);
      throw new Error(data.error);
    }
    
    console.log("Welcome email sent successfully:", data);
    return data;
  } catch (err) {
    console.error("Error in sendWelcomeEmail function:", err);
    
    // Add retry logic for transient errors
    if (err.message?.includes('NetworkError') || err.message?.includes('Failed to fetch')) {
      console.log("Network error detected, retrying once...");
      
      try {
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data, error } = await supabase.functions.invoke('send-welcome-email', {
          body: { 
            email,
            firstName,
            userType
          }
        });
        
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        
        console.log("Welcome email sent successfully on retry:", data);
        return data;
      } catch (retryErr) {
        console.error("Retry also failed:", retryErr);
        throw new Error(`Failed to send welcome email after retry: ${retryErr.message}`);
      }
    }
    
    throw err;
  }
};
