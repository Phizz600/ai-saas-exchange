
import { supabase } from './client';

/**
 * Tracks an event using Brevo's API (v3/events endpoint)
 * @param eventName The name of the event to track
 * @param identifiers Object containing email_id and optionally ext_id 
 * @param contactProperties Additional contact properties
 * @param eventProperties Additional event properties
 */
export const trackBrevoEventAPI = async (
  eventName: string,
  identifiers: { email_id: string; ext_id?: string },
  contactProperties?: Record<string, any>,
  eventProperties?: Record<string, any>
) => {
  try {
    console.log(`Tracking Brevo event via API: ${eventName}`);
    console.log('Identifiers:', identifiers);
    console.log('Contact properties:', contactProperties);
    console.log('Event properties:', eventProperties);
    
    const { data, error } = await supabase.functions.invoke('send-brevo-email', {
      body: {
        mode: 'track_event_api',
        eventName,
        identifiers,
        contactProperties,
        eventProperties
      }
    });

    if (error) {
      console.error('Error calling Brevo Events API function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Event tracked successfully via API:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in trackBrevoEventAPI:', error);
    return { success: false, error: error.message };
  }
};

// Alias for backward compatibility
export const sendBrevoEmail = trackBrevoEventAPI;

// BrevoTrack object for compatibility with eventTracking.ts
export const BrevoTrack = {
  push: async (args: any[]) => {
    try {
      if (args[0] === 'track' && args.length >= 3) {
        const eventName = args[1];
        const properties = args[2];
        const eventData = args[3] || {};
        
        // Extract email from properties
        const email = properties.email;
        
        if (!email) {
          throw new Error('Email is required for Brevo event tracking');
        }
        
        // Call the trackBrevoEventAPI with transformed parameters
        return await trackBrevoEventAPI(
          eventName,
          { email_id: email },
          properties,
          eventData
        );
      }
      throw new Error('Invalid Brevo Track command');
    } catch (error) {
      console.error('Error in BrevoTrack.push:', error);
      return { success: false, error: error.message };
    }
  }
};
