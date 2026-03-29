-- Add missing columns to categorias
ALTER TABLE public.categorias
ADD COLUMN IF NOT EXISTS subgrupo text,
ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true;

-- Add missing columns to configuracoes
ALTER TABLE public.configuracoes
ADD COLUMN IF NOT EXISTS cnpj text,
ADD COLUMN IF NOT EXISTS regime_tributario text;

-- Add ativo column to contas
ALTER TABLE public.contas
ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true;