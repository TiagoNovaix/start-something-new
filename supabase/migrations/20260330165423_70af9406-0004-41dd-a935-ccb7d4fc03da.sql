-- Create metas table
CREATE TABLE IF NOT EXISTS public.metas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    valor_objetivo NUMERIC(15, 2) NOT NULL,
    valor_atual NUMERIC(15, 2) DEFAULT 0,
    data_limite DATE,
    cor TEXT DEFAULT '#8B5CF6',
    icone TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for metas
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Create policy for metas
CREATE POLICY "Users can manage their own metas" 
ON public.metas FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at in metas
CREATE TRIGGER update_metas_updated_at 
BEFORE UPDATE ON public.metas 
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_metas_user_id ON public.metas(user_id);