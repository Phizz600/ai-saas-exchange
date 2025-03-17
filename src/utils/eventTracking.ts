
import { BrevoTrack } from "@/integrations/supabase/brevo";

/**
 * Track a cart update event
 * @param email User's email
 * @param firstName User's first name
 * @param lastName User's last name
 * @param cartId Cart ID
 * @param total Cart total
 * @param items Cart items
 */
export const trackCartUpdate = async (
  email: string,
  firstName: string,
  lastName: string,
  cartId: string,
  total: number,
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    url?: string;
    image?: string;
  }>
) => {
  try {
    const properties = {
      email,
      FIRSTNAME: firstName,
      LASTNAME: lastName
    };

    const eventData = {
      id: `cart:${cartId}`,
      data: {
        total,
        currency: "USD",
        url: window.location.href,
        items
      }
    };

    // Track the cart update event using Brevo
    const result = await BrevoTrack.push([
      "track",
      "cart_updated",
      properties,
      eventData
    ]);

    console.log("Cart update tracked:", result);
    return result;
  } catch (error) {
    console.error("Failed to track cart update:", error);
    return { success: false, error };
  }
};

/**
 * Example usage of the trackCartUpdate function:
 * 
 * // Import the function
 * import { trackCartUpdate } from "@/utils/eventTracking";
 * 
 * // Use it in your component
 * const handleAddToCart = async (product) => {
 *   // Add product to cart logic
 *   ...
 *   
 *   // Track the cart update
 *   await trackCartUpdate(
 *     user.email,
 *     user.firstName,
 *     user.lastName,
 *     cartId,
 *     cartTotal,
 *     cartItems
 *   );
 * };
 */
