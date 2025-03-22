
import { supabase } from './client';

export interface EscrowTransaction {
  id: string;
  conversation_id: string;
  product_id: string;
  seller_id: string;
  buyer_id: string;
  amount: number;
  platform_fee: number;
  escrow_fee: number;
  description?: string;
  agreed_terms?: Record<string, any>;
  status: string;
  escrow_api_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new escrow transaction from chat conversation
 */
export const createEscrowTransaction = async (
  conversationId: string,
  amount: number,
  description: string
) => {
  try {
    // Get conversation details
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select(`
        *,
        product:product_id (*)
      `)
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      console.error('Error fetching conversation:', convError);
      throw new Error('Could not find conversation');
    }

    // Calculate platform fee
    const platformFee = calculatePlatformFee(amount);

    // Create the escrow transaction
    const { data: transaction, error } = await supabase
      .from('escrow_transactions')
      .insert({
        conversation_id: conversationId,
        product_id: conversation.product_id,
        seller_id: conversation.seller_id,
        buyer_id: conversation.buyer_id,
        amount,
        platform_fee: platformFee,
        description,
        status: 'agreement_reached'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating escrow transaction:', error);
      throw error;
    }

    return transaction;
  } catch (error) {
    console.error('Error in createEscrowTransaction:', error);
    throw error;
  }
};

/**
 * Get escrow transaction by conversation ID
 */
export const getEscrowTransactionByConversation = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error fetching escrow transaction:', error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getEscrowTransactionByConversation:', error);
    return null;
  }
};

/**
 * Update escrow transaction status
 */
export const updateEscrowStatus = async (
  transactionId: string,
  status: string
) => {
  try {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({ status })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating escrow status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateEscrowStatus:', error);
    throw error;
  }
};

/**
 * Initialize escrow transaction with Escrow.com API
 */
export const initializeEscrowWithApi = async (transactionId: string) => {
  try {
    // First, get the transaction details
    const { data: transaction, error } = await supabase
      .from('escrow_transactions')
      .select(`
        *,
        product:product_id (*),
        buyer:buyer_id (email, full_name),
        seller:seller_id (email, full_name)
      `)
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      console.error('Error fetching transaction:', error);
      throw new Error('Could not find transaction');
    }

    // Call the Escrow.com API via our edge function
    const response = await supabase.functions.invoke('escrow-api', {
      body: {
        action: 'create',
        data: {
          internal_transaction_id: transaction.id,
          description: transaction.description || `Purchase of ${transaction.product.title}`,
          amount: transaction.amount,
          buyer_id: transaction.buyer_id,
          buyer_name: transaction.buyer?.full_name || 'Buyer',
          buyer_email: transaction.buyer?.email || '',
          seller_id: transaction.seller_id,
          seller_name: transaction.seller?.full_name || 'Seller',
          seller_email: transaction.seller?.email || ''
        }
      }
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error in initializeEscrowWithApi:', error);
    throw error;
  }
};

/**
 * Helper function to calculate platform fee based on tiered pricing
 */
const calculatePlatformFee = (amount: number): number => {
  let feePercentage = 0.05; // Default 5%
  
  if (amount <= 10000) {
    feePercentage = 0.10; // 10%
  } else if (amount <= 50000) {
    feePercentage = 0.08; // 8%
  } else if (amount <= 100000) {
    feePercentage = 0.06; // 6%
  }
  
  return parseFloat((amount * feePercentage).toFixed(2));
};
