-- Create centros_custo table
CREATE TABLE IF NOT EXISTS public.centros_custo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for centros_custo
ALTER TABLE public.centros_custo ENABLE ROW LEVEL SECURITY;

-- Create policy for centros_custo
CREATE POLICY "Users can manage their own centros_custo" 
ON public.centros_custo FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at in centros_custo
CREATE TRIGGER update_centros_custo_updated_at 
BEFORE UPDATE ON public.centros_custo 
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add centro_custo_id to lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS centro_custo_id UUID REFERENCES public.centros_custo(id) ON DELETE SET NULL;

-- Add conciliado to lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS conciliado BOOLEAN DEFAULT false;

-- Add parent_id to categorias for hierarchy
ALTER TABLE public.categorias 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL;

-- Add preferencias to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferencias JSONB DEFAULT '{}'::jsonb;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_lancamentos_centro_custo_id ON public.lancamentos(centro_custo_id);
CREATE INDEX IF NOT EXISTS idx_centros_custo_user_id ON public.centros_custo(user_id);
CREATE INDEX IF NOT EXISTS idx_categorias_parent_id ON public.categorias(parent_id);
