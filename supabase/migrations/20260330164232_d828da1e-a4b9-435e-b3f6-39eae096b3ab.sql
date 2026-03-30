-- Move vector extension to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;

-- Fix Function Search Path Mutable for custom functions
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.set_user_id() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.match_documents(vector, integer, jsonb) SET search_path = public, extensions;
ALTER FUNCTION public.match_vector_soluv(vector, integer, jsonb) SET search_path = public, extensions;

-- Create missing vector tables referenced by functions
CREATE TABLE IF NOT EXISTS public.documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding extensions.vector(1536)
);

CREATE TABLE IF NOT EXISTS public.vector_soluv (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding extensions.vector(1536)
);

-- Enable RLS for the new tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_soluv ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies
CREATE POLICY "Users can view all documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view all vector_soluv" ON public.vector_soluv FOR SELECT TO authenticated USING (true);
