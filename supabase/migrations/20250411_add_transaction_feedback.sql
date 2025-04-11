
-- Create transaction feedback table
CREATE TABLE IF NOT EXISTS public.transaction_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.escrow_transactions(id),
  user_id UUID NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('buyer', 'seller')),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_transaction_feedback_transaction_id ON public.transaction_feedback(transaction_id);

-- Add index for user feedback lookup
CREATE INDEX IF NOT EXISTS idx_transaction_feedback_user_id ON public.transaction_feedback(user_id);

-- Add RLS policies
ALTER TABLE public.transaction_feedback ENABLE ROW LEVEL SECURITY;

-- Users can only see feedback for transactions they're involved in
CREATE POLICY "Users can view feedback for their transactions" ON public.transaction_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.escrow_transactions et
      WHERE et.id = transaction_id
      AND (et.buyer_id = auth.uid() OR et.seller_id = auth.uid())
    )
  );

-- Users can insert feedback for transactions they're involved in
CREATE POLICY "Users can add feedback for their transactions" ON public.transaction_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.escrow_transactions et
      WHERE et.id = transaction_id
      AND (
        (et.buyer_id = auth.uid() AND user_role = 'buyer') OR
        (et.seller_id = auth.uid() AND user_role = 'seller')
      )
    )
  );

-- Users can only update their own feedback
CREATE POLICY "Users can update their own feedback" ON public.transaction_feedback
  FOR UPDATE USING (user_id = auth.uid());

-- Users can only delete their own feedback
CREATE POLICY "Users can delete their own feedback" ON public.transaction_feedback
  FOR DELETE USING (user_id = auth.uid());
