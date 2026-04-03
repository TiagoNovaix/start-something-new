
-- 1. Drop and recreate storage policies
DROP POLICY IF EXISTS "Users can view own files in zaip_ai" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own files in zaip_ai" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files in zaip_ai" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files in zaip_ai" ON storage.objects;

CREATE POLICY "Users can view own files in zaip_ai"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'zaip_ai' AND auth.uid()::text = (string_to_array(name, '/'))[2]);

CREATE POLICY "Users can upload own files in zaip_ai"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'zaip_ai' AND auth.uid()::text = (string_to_array(name, '/'))[2]);

CREATE POLICY "Users can update own files in zaip_ai"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'zaip_ai' AND auth.uid()::text = (string_to_array(name, '/'))[2]);

CREATE POLICY "Users can delete own files in zaip_ai"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'zaip_ai' AND auth.uid()::text = (string_to_array(name, '/'))[2]);
