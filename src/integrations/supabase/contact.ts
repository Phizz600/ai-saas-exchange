
import { supabase } from './client';

/**
 * Send a contact form message to the support team
 * @param name Sender's name
 * @param email Sender's email
 * @param subject Message subject
 * @param message Message content
 */
export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    console.log("Sending contact form message...");
    
    const { data, error } = await supabase.functions.invoke('send-contact-email', {
      body: { name, email, subject, message }
    });

    if (error) {
      console.error('Error calling contact email function:', error);
      return { success: false, error: error.message };
    }
    
    // Check if the response contains an error message
    if (data && !data.success) {
      console.error('Error response from contact email function:', data.error);
      return { success: false, error: data.error || 'Failed to send message' };
    }
    
    console.log('Contact message sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendContactEmail:', error);
    return { success: false, error: error.message };
  }
};
