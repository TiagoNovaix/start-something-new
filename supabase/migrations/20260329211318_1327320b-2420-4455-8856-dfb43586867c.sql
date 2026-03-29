-- Improve database schema for Control Tower finance app

-- 1. Fix unique constraint on fechamentos to be per user
ALTER TABLE public.fechamentos DROP CONSTRAINT IF EXISTS fechamentos_mes_ano_key;
ALTER TABLE public.fechamentos ADD CONSTRAINT fechamentos_user_id_mes_ano_key UNIQUE (user_id, mes, ano);

-- 2. Add destination account for transfers in lancamentos
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS conta_destino_id UUID REFERENCES public.contas(id) ON DELETE SET NULL;

-- 3. Create orçamentos table for monthly budgets
CREATE TABLE IF NOT EXISTS public.orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
  valor_planejado NUMERIC(15, 2) NOT NULL DEFAULT 0,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, categoria_id, mes, ano)
);

-- Enable RLS for orçamentos
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

-- Policy for orçamentos
CREATE POLICY "Users can manage their own orçamentos" 
ON public.orcamentos FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Trigger for orçamentos
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Add relationship from reservas to contas (optional but useful)
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL;

-- 5. Add a column for 'is_recurring' or similar to lancamentos? Let's keep it simple for now.

-- 6. Ensure all tables have user_id and proper RLS
-- (Already mostly done in previous migrations, but good to double check)
