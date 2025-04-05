
import { supabase } from './client';

/**
 * This file is kept for backward compatibility
 * We have migrated from Brevo to Resend for email functionality
 */

export const trackBrevoEventAPI = async (
  eventName: string,
  identifiers: { email_id: string; ext_id?: string },
  contactProperties?: Record<string, any>,
  eventProperties?: Record<string, any>
) => {
  console.warn('Brevo has been replaced with Resend. Please update your code to use Resend directly.');
  return { success: false, error: 'Brevo has been replaced with Resend' };
};

// Alias for backward compatibility
export const sendBrevoEmail = trackBrevoEventAPI;

// BrevoTrack object for compatibility with eventTracking.ts
export const BrevoTrack = {
  push: async (args: any[]) => {
    console.warn('Brevo has been replaced with Resend. Please update your code to use Resend directly.');
    return { success: false, error: 'Brevo has been replaced with Resend' };
  }
};
