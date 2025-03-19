
import { supabase } from './client';

/**
 * Sends an email using Brevo through the Supabase edge function
 * @param event The event triggering the email
 * @param recipient The email recipient
 * @param templateId Optional Brevo template ID (if not provided, will use mapping based on event)
 * @param params Optional parameters to be used in the email template
 */
export const sendBrevoEmail = async (
  event: 'user_signup' | 'product_listed' | 'offer_received' | 'pitch_deck_generated' | 'cart_updated' | string,
  recipient: string,
  templateId?: number,
  params?: Record<string, any>
) => {
  try {
    if (!recipient || !recipient.includes('@')) {
      console.error('Invalid email recipient:', recipient);
      return { success: false, error: 'Invalid email recipient' };
    }

    console.log(`Sending ${event} email to ${recipient}`);
    const { data, error } = await supabase.functions.invoke('send-brevo-email', {
      body: {
        event,
        recipient,
        templateId,
        params
      }
    });

    if (error) {
      console.error('Error calling send-brevo-email function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendBrevoEmail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Tracks an event using Brevo through the Supabase edge function (JS style)
 * @param eventName The name of the event to track
 * @param properties Properties to associate with the event (e.g. user info)
 * @param eventData Additional data related to the event
 */
export const trackBrevoEvent = async (
  eventName: string,
  properties?: Record<string, any>,
  eventData?: Record<string, any>
) => {
  try {
    console.log(`Tracking Brevo event: ${eventName}`);
    console.log('Event properties:', properties);
    console.log('Event data:', eventData);
    
    const { data, error } = await supabase.functions.invoke('send-brevo-email', {
      body: {
        mode: 'track_event',
        eventName,
        properties,
        eventData
      }
    });

    if (error) {
      console.error('Error calling Brevo tracking function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Event tracked successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in trackBrevoEvent:', error);
    return { success: false, error: error.message };
  }
};

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

/**
 * JavaScript-style Brevo tracking function that mimics the Brevo.push API
 * This provides a similar interface to what you'd use with Brevo's JavaScript SDK
 * @param args Array containing command, event name, properties, and event data
 */
export const BrevoTrack = {
  push: async (args: [string, string, Record<string, any>?, Record<string, any>?]) => {
    try {
      if (args[0] !== 'track') {
        console.error('Unsupported Brevo command:', args[0]);
        return { success: false, error: 'Unsupported command' };
      }
      
      const [_, eventName, properties, eventData] = args;
      
      return await trackBrevoEvent(eventName, properties, eventData);
    } catch (error) {
      console.error('Error in BrevoTrack.push:', error);
      return { success: false, error: error.message };
    }
  }
};
