-- Adiciona coluna de cor para as contas
ALTER TABLE public.contas 
ADD COLUMN IF NOT EXISTS cor TEXT DEFAULT '#8B5CF6';