
import { supabase } from "./client";

/**
 * Send an escrow action reminder
 */
export const sendEscrowReminder = async (
  conversationId: string,
  transactionId: string,
  userRole: "buyer" | "seller",
  status: string,
  hoursRemaining: number
) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-escrow-reminder", {
      body: {
        conversationId,
        transactionId,
        userRole,
        status,
        hoursRemaining
      }
    });

    if (error) {
      console.error("Error sending escrow reminder:", error);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error("Error in sendEscrowReminder:", error);
    return false;
  }
};

/**
 * Send auction result email notification
 */
export const sendAuctionResultEmail = async (productId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-auction-result", {
      body: {
        productId
      }
    });

    if (error) {
      console.error("Error sending auction result email:", error);
      throw new Error("Failed to send auction result email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendAuctionResultEmail:", error);
    throw error;
  }
};

/**
 * Check and update escrow transaction status
 */
export const updateEscrowLifecycle = async (
  transactionId: string,
  newStatus: string,
  message?: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke("escrow-api", {
      body: {
        action: "lifecycle_update",
        data: {
          transaction_id: transactionId,
          new_status: newStatus,
          message
        }
      }
    });

    if (error) {
      console.error("Error updating transaction lifecycle:", error);
      throw new Error("Failed to update transaction status");
    }

    return data;
  } catch (error) {
    console.error("Error in updateEscrowLifecycle:", error);
    throw error;
  }
};
