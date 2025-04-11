
-- Enable bucket for escrow delivery proof files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'escrow-deliveries',
  'escrow-deliveries',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'video/mp4', 'text/plain', 'application/zip']::text[]
);

-- Add a policy to allow authenticated users to upload files
CREATE POLICY "Users can upload escrow delivery proofs" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'escrow-deliveries');

-- Add a policy to allow authenticated users to read files from the bucket
CREATE POLICY "Users can view escrow delivery proofs" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'escrow-deliveries');

-- Create a procedure to clean up unused delivery files
CREATE OR REPLACE FUNCTION clean_escrow_deliveries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete files older than 90 days
  DELETE FROM storage.objects 
  WHERE bucket_id = 'escrow-deliveries' 
  AND created_at < now() - INTERVAL '90 days';
END;
$$;
