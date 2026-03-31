-- Fix search path for remaining public functions to resolve linter warnings
ALTER FUNCTION public.update_reserva_saldo() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Add user_id to vector-related tables for secure data isolation
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.vector_soluv ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Add soft-delete support (deleted_at) to core tables for consistency
ALTER TABLE public.categorias ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.contas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.socios ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.centros_custo ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policies for documents to ensure user isolation
DROP POLICY IF EXISTS "Users can view all documents" ON public.documents;
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Update RLS policies for vector_soluv to ensure user isolation
DROP POLICY IF EXISTS "Users can view all vector_soluv" ON public.vector_soluv;
CREATE POLICY "Users can view their own vector_soluv" ON public.vector_soluv FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own vector_soluv" ON public.vector_soluv FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vector_soluv" ON public.vector_soluv FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vector_soluv" ON public.vector_soluv FOR DELETE TO authenticated USING (auth.uid() = user_id);