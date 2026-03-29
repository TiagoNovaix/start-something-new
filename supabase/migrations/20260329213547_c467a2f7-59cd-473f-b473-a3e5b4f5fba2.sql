-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers to all tables that have the column
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
    END LOOP;
END;
$$;

-- Add indexes for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria_id ON public.lancamentos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_lancamentos_conta_id ON public.lancamentos(conta_id);

CREATE INDEX IF NOT EXISTS idx_categorias_user_id ON public.categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_contas_user_id ON public.contas(user_id);
CREATE INDEX IF NOT EXISTS idx_socios_user_id ON public.socios(user_id);
CREATE INDEX IF NOT EXISTS idx_reservas_user_id ON public.reservas(user_id);
CREATE INDEX IF NOT EXISTS idx_fechamentos_user_id ON public.fechamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id ON public.orcamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_transferencias_user_id ON public.transferencias(user_id);
CREATE INDEX IF NOT EXISTS idx_modelos_recorrentes_user_id ON public.modelos_recorrentes(user_id);

-- Add tags and fixed columns to lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS fixo BOOLEAN DEFAULT false;

-- Add description to categorias
ALTER TABLE public.categorias 
ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Add index for tags search
CREATE INDEX IF NOT EXISTS idx_lancamentos_tags ON public.lancamentos USING GIN(tags);