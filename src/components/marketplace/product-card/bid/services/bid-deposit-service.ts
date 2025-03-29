
import { supabase } from "@/integrations/supabase/client";

interface DepositInitiationParams {
  productId: string;
  bidAmount: number;
  depositAmount: number;
  platformFee: number;
  productTitle: string;
}

export async function initiateDeposit({
  productId,
  bidAmount,
  depositAmount,
  platformFee,
  productTitle
}: DepositInitiationParams) {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
      
  if (!user) {
    throw new Error("You must be logged in to make a deposit");
  }
  
  // Get the product information
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, title, seller_id')
    .eq('id', productId)
    .single();
    
  if (productError || !product) {
    console.error('Product query error:', productError);
    throw new Error("Could not retrieve product information");
  }
  
  // Get seller information separately
  const { data: seller, error: sellerError } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', product.seller_id)
    .single();
    
  if (sellerError) {
    console.error('Seller query error:', sellerError);
    throw new Error("Could not retrieve seller information");
  }
  
  // Get buyer information
  const { data: buyer, error: buyerError } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();
    
  if (buyerError || !buyer) {
    console.error('Buyer query error:', buyerError);
    throw new Error("Could not retrieve your profile information");
  }

  // Get seller information safely
  const sellerName = seller?.full_name || 'Seller';
  const sellerEmail = seller?.email || '';

  // Create escrow transaction for deposit
  const { data: escrowTransaction, error: escrowError } = await supabase
    .from('escrow_transactions')
    .insert({
      product_id: productId,
      seller_id: product.seller_id,
      buyer_id: user.id,
      amount: depositAmount,
      platform_fee: platformFee,
      escrow_fee: 0, // No escrow fee for deposits
      description: `Deposit for bid on ${product.title}`,
      status: 'deposit_pending'
    })
    .select()
    .single();

  if (escrowError || !escrowTransaction) {
    console.error('Escrow transaction error:', escrowError);
    throw new Error("Failed to create escrow transaction for deposit");
  }

  console.log('Initiating escrow with API for transaction:', escrowTransaction.id);
  
  // Initialize escrow with Escrow.com API
  const response = await supabase.functions.invoke('escrow-api', {
    body: {
      action: 'create',
      data: {
        internal_transaction_id: escrowTransaction.id,
        description: `Deposit for bid on ${product.title}`,
        amount: depositAmount,
        buyer_id: user.id,
        buyer_name: buyer.full_name || 'Buyer',
        buyer_email: buyer.email || user.email,
        seller_id: product.seller_id,
        seller_name: sellerName,
        seller_email: sellerEmail,
        timeline: '14 days',
        platform_fee: platformFee,
        product_id: productId,
        isDeposit: true
      }
    }
  });

  if (response.error) {
    console.error('Escrow API error:', response.error);
    throw new Error(`Escrow API error: ${response.error}`);
  }
  
  console.log('Escrow API response:', response);
  
  return escrowTransaction.id;
}
