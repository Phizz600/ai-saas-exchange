
import { supabase } from './client';

export interface TransactionFeedback {
  id: string;
  transaction_id: string;
  user_id: string;
  user_role: 'buyer' | 'seller';
  rating: number;
  feedback?: string;
  created_at: string;
  conversation_id: string;
}

/**
 * Get transaction feedback for a specific transaction
 */
export const getTransactionFeedback = async (transactionId: string) => {
  try {
    const { data, error } = await supabase
      .from('transaction_feedback')
      .select('*')
      .eq('transaction_id', transactionId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting transaction feedback:', error);
    throw error;
  }
};

/**
 * Check if a user has already submitted feedback for a transaction
 */
export const hasUserSubmittedFeedback = async (transactionId: string, userId: string) => {
  try {
    const { data, error, count } = await supabase
      .from('transaction_feedback')
      .select('*', { count: 'exact' })
      .eq('transaction_id', transactionId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking user feedback:', error);
    throw error;
  }
};

/**
 * Get average rating for a seller from all completed transactions
 */
export const getSellerRating = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from('transaction_feedback')
      .select(`
        rating,
        transaction:transaction_id (
          seller_id
        )
      `)
      .eq('transaction:seller_id', sellerId)
      .eq('user_role', 'buyer');
      
    if (error) throw error;
    
    if (!data || data.length === 0) return null;
    
    // Calculate average rating
    const sum = data.reduce((acc, item) => acc + item.rating, 0);
    return {
      average: sum / data.length,
      count: data.length
    };
  } catch (error) {
    console.error('Error getting seller rating:', error);
    throw error;
  }
};
