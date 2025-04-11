
-- Enable realtime for escrow_transactions table
ALTER TABLE escrow_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE escrow_transactions;

-- Add a trigger to notify about status changes
CREATE OR REPLACE FUNCTION public.notify_escrow_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Skip if status didn't change
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;
  
  -- Notify both buyer and seller
  INSERT INTO notifications (
    user_id, 
    title, 
    message, 
    type, 
    related_product_id
  )
  SELECT 
    NEW.seller_id,
    'Escrow Update: ' || NEW.status,
    'Escrow transaction for $' || NEW.amount || ' has been updated to status: ' || NEW.status,
    'escrow_update',
    NEW.product_id;
    
  INSERT INTO notifications (
    user_id, 
    title, 
    message, 
    type, 
    related_product_id
  )
  SELECT 
    NEW.buyer_id,
    'Escrow Update: ' || NEW.status,
    'Escrow transaction for $' || NEW.amount || ' has been updated to status: ' || NEW.status,
    'escrow_update',
    NEW.product_id;
    
  -- Update conversation escrow status
  UPDATE conversations
  SET escrow_status = NEW.status
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$function$;

-- Add the trigger to the escrow_transactions table
DROP TRIGGER IF EXISTS escrow_status_change_trigger ON escrow_transactions;
CREATE TRIGGER escrow_status_change_trigger
AFTER UPDATE ON escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION notify_escrow_status_change();
