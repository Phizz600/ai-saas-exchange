-- Add new DFaaS-focused columns to products table
-- Only add columns that don't exist; safe for existing data

-- Identification / lineage
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS source_updated_at timestamptz;

-- Core description
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS long_description text;

-- Links & media
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS listing_url text,
  ADD COLUMN IF NOT EXISTS review_link text;

-- Seller intent / story
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS reason_for_selling text,
  ADD COLUMN IF NOT EXISTS built_by text,
  ADD COLUMN IF NOT EXISTS traffic_sources text[];

-- Governance / consent
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS tos_agreed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tos_agreed_at timestamptz,
  ADD COLUMN IF NOT EXISTS contact_number text;

-- Optional structured trend
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS revenue_trend_3m jsonb;

-- Ensure storage bucket exists for listing assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-assets', 'listing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for listing-assets bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their listing assets'
  ) THEN
    CREATE POLICY "Users can upload their listing assets"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'listing-assets' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Listing assets are publicly accessible'
  ) THEN
    CREATE POLICY "Listing assets are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'listing-assets');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their listing assets'
  ) THEN
    CREATE POLICY "Users can update their listing assets"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'listing-assets' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their listing assets'
  ) THEN
    CREATE POLICY "Users can delete their listing assets"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'listing-assets' 
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;