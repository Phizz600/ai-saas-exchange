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
  timeline?: string;
}

/**
 * Parse a message content to extract potential escrow terms
 */
export const parseMessageForEscrowTerms = (message: string): {
  amount?: number;
  timeline?: string;
  description?: string;
} => {
  const terms: { amount?: number; timeline?: string; description?: string } = {};
  
  // Extract amount - look for dollar amounts
  const amountRegex = /\$(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)(k|K|thousand|million|m|M)?/g;
  const amountMatches = message.match(amountRegex);
  
  if (amountMatches && amountMatches.length > 0) {
    let amountStr = amountMatches[0].replace(/[$,]/g, '');
    let multiplier = 1;
    
    // Handle k/thousand/m/million
    if (amountStr.match(/(k|K|thousand)$/)) {
      multiplier = 1000;
      amountStr = amountStr.replace(/(k|K|thousand)$/, '');
    } else if (amountStr.match(/(m|M|million)$/)) {
      multiplier = 1000000;
      amountStr = amountStr.replace(/(m|M|million)$/, '');
    }
    
    terms.amount = parseFloat(amountStr) * multiplier;
  }
  
  // Extract timeline
  const timelineRegex = /(\d+)\s*(day|days|week|weeks|month|months)/gi;
  const timelineMatch = timelineRegex.exec(message);
  
  if (timelineMatch) {
    const duration = parseInt(timelineMatch[1]);
    const unit = timelineMatch[2].toLowerCase();
    terms.timeline = `${duration} ${unit}`;
  }
  
  // Extract description - find text after "for" or ":"
  const descriptionRegex = /(?:for|:)\s*([^.!?$]+)/i;
  const descriptionMatch = descriptionRegex.exec(message);
  
  if (descriptionMatch) {
    terms.description = descriptionMatch[1].trim();
  }
  
  return terms;
}

/**
 * Calculate escrow fee based on amount (estimated)
 */
export const calculateEscrowFee = (amount: number): number => {
  // This is an estimation - actual fees may vary
  if (amount <= 5000) {
    return amount * 0.035; // 3.5% for smaller transactions
  } else if (amount <= 25000) {
    return amount * 0.032; // 3.2%
  } else if (amount <= 100000) {
    return amount * 0.029; // 2.9%
  } else {
    return amount * 0.025; // 2.5% for large transactions
  }
};

/**
 * Create a new escrow transaction from chat conversation
 */
export const createEscrowTransaction = async (
  conversationId: string,
  amount: number,
  description: string,
  timeline?: string
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
    
    // Calculate estimated escrow fee
    const escrowFee = calculateEscrowFee(amount);

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
        escrow_fee: escrowFee,
        description,
        timeline,
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
      .update({ status, updated_at: new Date().toISOString() })
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
 * Add a payment receipt message to the conversation
 */
export const addPaymentReceiptMessage = async (
  conversationId: string,
  transactionId: string, 
  paymentIntentId: string,
  amount: number
) => {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: 'system',
        content: `📜 **Payment Receipt**\n\n**Amount:** $${amount.toFixed(2)}\n**Transaction ID:** ${transactionId.substring(0, 8)}...\n**Payment Reference:** ${paymentIntentId.substring(0, 8)}...\n**Date:** ${new Date().toLocaleDateString()}\n\nThe payment has been received and the funds are now held in escrow. They will be released to the seller upon completion of the transaction.`
      });

    if (error) {
      console.error('Error adding payment receipt message:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addPaymentReceiptMessage:', error);
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
          seller_email: transaction.seller?.email || '',
          timeline: transaction.timeline || '30 days',
          platform_fee: transaction.platform_fee,
          escrow_fee: transaction.escrow_fee
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
 * Generate escrow transaction summary for download
 */
export const generateEscrowSummaryForDownload = (transaction: EscrowTransaction): string => {
  const summary = {
    transactionId: transaction.id.substring(0, 8),
    amount: transaction.amount,
    platformFee: transaction.platform_fee,
    escrowFee: transaction.escrow_fee,
    totalAmount: transaction.amount + transaction.platform_fee + transaction.escrow_fee,
    description: transaction.description,
    timeline: transaction.timeline || '30 days',
    status: transaction.status,
    created: transaction.created_at,
    instructions: "To complete this transaction manually on Escrow.com:"
  };

  // Generate a simple HTML for download
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Escrow Transaction Summary</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #333; }
      .summary { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
      .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
      .amount { font-weight: bold; }
      .steps { margin-top: 20px; }
      .steps ol { padding-left: 20px; }
    </style>
  </head>
  <body>
    <h1>Escrow Transaction Summary</h1>
    <div class="summary">
      <p><strong>Transaction ID:</strong> ${summary.transactionId}</p>
      <p><strong>Description:</strong> ${summary.description}</p>
      <p><strong>Timeline:</strong> ${summary.timeline}</p>
      <p><strong>Transaction Amount:</strong> $${summary.amount.toFixed(2)}</p>
      <p><strong>Platform Fee:</strong> $${summary.platformFee.toFixed(2)}</p>
      <p><strong>Escrow Fee (estimated):</strong> $${summary.escrowFee.toFixed(2)}</p>
      <p class="amount"><strong>Total Amount:</strong> $${summary.totalAmount.toFixed(2)}</p>
      <p><strong>Status:</strong> ${summary.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
      <p><strong>Created:</strong> ${new Date(summary.created).toLocaleString()}</p>
      
      <div class="steps">
        <h3>${summary.instructions}</h3>
        <ol>
          <li>Go to <a href="https://www.escrow.com" target="_blank">Escrow.com</a> and create an account if you don't have one.</li>
          <li>Select "Start a Transaction" and choose "Domain Name" as the transaction type.</li>
          <li>Enter the details exactly as shown in this summary.</li>
          <li>Follow the Escrow.com instructions to complete the transaction.</li>
          <li>Return to AI Exchange to update the transaction status.</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      <p>This transaction summary was generated by AI Exchange on ${new Date().toLocaleString()}</p>
    </div>
  </body>
  </html>
  `;
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

/**
 * Check if any delivery proof files exist for a transaction
 */
export const getDeliveryProofFiles = async (transactionId: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('escrow-deliveries')
      .list(transactionId);
    
    if (error) {
      console.error('Error listing delivery files:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getDeliveryProofFiles:', error);
    return [];
  }
};

/**
 * Send automated reminder for pending escrow actions
 */
export const sendEscrowActionReminder = async (
  conversationId: string,
  transactionId: string,
  userRole: "buyer" | "seller",
  status: string,
  hoursRemaining: number
) => {
  try {
    let reminderMessage = "";
    
    if (status === "agreement_reached" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Payment Due Soon**\n\nYour payment for this transaction is due within ${Math.floor(hoursRemaining)} hours. Please complete the payment to proceed with the transaction.`;
    } else if (status === "payment_secured" && userRole === "seller") {
      reminderMessage = `⏰ **Reminder: Delivery Due Soon**\n\nYou need to confirm delivery of this transaction within ${Math.floor(hoursRemaining)} hours. Please provide delivery details to proceed.`;
    } else if (status === "delivery_in_progress" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Confirmation Due Soon**\n\nPlease confirm receipt of your purchase within ${Math.floor(hoursRemaining)} hours.`;
    } else if (status === "inspection_period" && userRole === "buyer") {
      reminderMessage = `⏰ **Reminder: Inspection Period Ending Soon**\n\nYour inspection period will end in ${Math.floor(hoursRemaining)} hours. Please complete your verification to release funds to the seller.`;
    } else {
      return false; // No applicable reminder
    }
    
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: reminderMessage,
        sender_id: 'system'
      });
    
    if (error) {
      console.error('Error sending escrow reminder:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendEscrowActionReminder:', error);
    return false;
  }
};

// Add a new notification function for funds release
export const notifyFundsReleased = async (
  transactionId: string,
  conversationId: string
) => {
  try {
    // Get the transaction details
    const { data: transaction, error } = await supabase
      .from('escrow_transactions')
      .select(`
        *,
        product:product_id (title)
      `)
      .eq('id', transactionId)
      .single();
    
    if (error || !transaction) {
      console.error('Error fetching transaction for notification:', error);
      throw error;
    }
    
    // Add a message to the conversation
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: 'system',
        content: `💰 **FUNDS RELEASED**\n\nThe funds for this transaction ($${transaction.amount.toFixed(2)}) have been released to the seller. Thank you for using our escrow service!\n\nTransaction ID: ${transactionId.substring(0, 8)}\nProduct: ${transaction.product.title}`
      });
    
    // Create notifications for both buyer and seller
    await Promise.all([
      // Notify the seller
      supabase.from('notifications').insert({
        user_id: transaction.seller_id,
        title: 'Funds Released!',
        message: `Payment of $${transaction.amount.toFixed(2)} has been released to your account for the sale of ${transaction.product.title}`,
        type: 'escrow_completed',
        related_product_id: transaction.product_id
      }),
      // Notify the buyer
      supabase.from('notifications').insert({
        user_id: transaction.buyer_id,
        title: 'Transaction Completed',
        message: `Your payment of $${transaction.amount.toFixed(2)} for ${transaction.product.title} has been released to the seller. Transaction complete!`,
        type: 'escrow_completed',
        related_product_id: transaction.product_id
      })
    ]);
    
    return true;
  } catch (error) {
    console.error('Error sending funds release notifications:', error);
    throw error;
  }
};
