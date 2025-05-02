
import { supabase } from './client';

/**
 * Track an event via the Brevo Events API
 * @param eventName Name of the event to track
 * @param identifiers Object with email_id or ext_id (required)
 * @param contactProperties Optional contact properties to update
 * @param eventProperties Optional event properties
 * @returns Response from the Brevo API
 */
export const trackBrevoEventAPI = async (
  eventName: string,
  identifiers: { email_id: string; ext_id?: string },
  contactProperties?: Record<string, any>,
  eventProperties?: Record<string, any>
) => {
  try {
    console.log(`Sending Brevo event via Edge Function: ${eventName}`);
    
    const response = await supabase.functions.invoke('send-brevo-email', {
      body: JSON.stringify({
        mode: 'track_event_api',
        eventName,
        identifiers,
        contactProperties,
        eventProperties
      })
    });

    if (response.error) {
      console.error('Error from Brevo tracking function:', response.error);
      return { success: false, error: response.error.message || 'Failed to track event' };
    }

    return response.data || { success: true };
  } catch (error) {
    console.error('Error invoking Brevo tracking function:', error);
    return { success: false, error: String(error) };
  }
};

// Alias for backward compatibility
export const sendBrevoEmail = trackBrevoEventAPI;

// BrevoTrack object for compatibility with eventTracking.ts
export const BrevoTrack = {
  push: async (args: any[]) => {
    try {
      // Standard format is: ['track', eventName, properties, eventData]
      if (args.length >= 2 && args[0] === 'track') {
        const eventName = args[1];
        const contactProperties = args.length >= 3 ? args[2] : {};
        const eventProperties = args.length >= 4 ? args[3] : {};
        
        // Extract email from properties
        const email = contactProperties.email || '';
        if (!email) {
          console.error('Email is required for Brevo tracking');
          return { success: false, error: 'Email is required' };
        }
        
        return await trackBrevoEventAPI(
          eventName,
          { email_id: email },
          contactProperties,
          eventProperties
        );
      }
      
      return { success: false, error: 'Invalid Brevo tracking format' };
    } catch (error) {
      console.error('Error in BrevoTrack.push:', error);
      return { success: false, error: String(error) };
    }
  }
};
