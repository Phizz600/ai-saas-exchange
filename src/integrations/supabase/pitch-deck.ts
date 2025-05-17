
import { supabase } from './client';
import { sendBrevoEmail } from './brevo';

export const createPitchDeck = async (
  userId: string,
  companyName: string,
  problem: string,
  solution: string,
  targetMarket: string,
  revenueModel: string,
  marketSize: string,
  competition: string,
  team: string,
  fundingNeeded: string,
  contactInfo: string
) => {
  try {
    const { data, error } = await supabase
      .from('pitch_decks')
      .insert([
        {
          user_id: userId,
          company_name: companyName,
          problem: problem,
          solution: solution,
          target_market: targetMarket,
          revenue_model: revenueModel,
          market_size: marketSize,
          competition: competition,
          team: team,
          funding_needed: fundingNeeded,
          contact_info: contactInfo,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating pitch deck:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating pitch deck:', error);
    return { success: false, error };
  }
};

export const getPitchDeck = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('pitch_decks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching pitch deck:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching pitch deck:', error);
    return { success: false, error };
  }
};

// Function that was causing the TypeScript error - fixed by changing email_id to email
export const notifyAboutPitchDeck = async (userEmail: string) => {
  try {
    // Use sendBrevoEmail with the correct parameter type (an object with email)
    await sendBrevoEmail(
      'pitch_deck_generated',
      { email: userEmail }, // Changed from email_id to email to match the expected type
      { source: 'Pitch Deck Generator' }
    );
    return { success: true };
  } catch (error) {
    console.error('Error notifying about pitch deck:', error);
    return { success: false, error };
  }
};
