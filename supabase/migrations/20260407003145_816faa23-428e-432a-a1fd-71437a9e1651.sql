-- Add logo_url column
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url text;

-- Create public storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: company members can view logos
CREATE POLICY "Company members can view logos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'company-logos');

-- Storage RLS: company admins can upload logos
CREATE POLICY "Company admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND public.check_user_is_company_admin((string_to_array(name, '/'))[1]::uuid)
);

-- Storage RLS: company admins can update logos
CREATE POLICY "Company admins can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND public.check_user_is_company_admin((string_to_array(name, '/'))[1]::uuid)
);

-- Storage RLS: company admins can delete logos
CREATE POLICY "Company admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND public.check_user_is_company_admin((string_to_array(name, '/'))[1]::uuid)
);