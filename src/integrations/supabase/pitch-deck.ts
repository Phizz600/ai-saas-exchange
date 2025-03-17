
import { supabase } from './client';
import { sendBrevoEmail } from './brevo';

/**
 * Generate a pitch deck using OpenAI
 */
export const generatePitchDeck = async (
  title: string,
  description: string,
  category: string,
  stage: string,
  monthlyRevenue?: number
) => {
  try {
    console.log('Requesting pitch deck generation for:', title);
    const { data, error } = await supabase.functions.invoke('generate-pitch-deck', {
      body: {
        title,
        description,
        category,
        stage,
        monthlyRevenue
      }
    });

    if (error) {
      console.error('Error calling generate-pitch-deck function:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Pitch deck generated successfully');
    
    // Optionally send an email notification about the generated pitch deck
    const user = await supabase.auth.getUser();
    if (user.data?.user?.email) {
      await sendBrevoEmail(
        'pitch_deck_generated',
        user.data.user.email,
        undefined,
        { 
          productTitle: title,
          userFirstName: user.data.user.user_metadata?.first_name || 'there'
        }
      );
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in generatePitchDeck:', error);
    return { success: false, error: error.message };
  }
};
