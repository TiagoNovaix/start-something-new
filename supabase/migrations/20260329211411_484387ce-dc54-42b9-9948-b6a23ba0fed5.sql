-- Add status and payment details to lancamentos
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pago', 'pendente', 'atrasado', 'cancelado')),
ADD COLUMN IF NOT EXISTS data_pagamento DATE,
ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT CHECK (metodo_pagamento IN ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro', 'transferencia', 'outros')),
ADD COLUMN IF NOT EXISTS recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS frequencia_recorrencia TEXT CHECK (frequencia_recorrencia IN ('mensal', 'semanal', 'anual', 'diario')),
ADD COLUMN IF NOT EXISTS parcelado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_parcela INTEGER,
ADD COLUMN IF NOT EXISTS total_parcelas INTEGER;

-- Create an index for faster filtering by status and date
CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON public.lancamentos(status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id ON public.lancamentos(user_id);

-- Update existing records to have a status if they don't
UPDATE public.lancamentos SET status = 'pago' WHERE status IS NULL;

-- Create a table for Transferencias to link two transactions
CREATE TABLE IF NOT EXISTS public.transferencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origem_lancamento_id UUID REFERENCES public.lancamentos(id) ON DELETE CASCADE,
  destino_lancamento_id UUID REFERENCES public.lancamentos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for transferencias
ALTER TABLE public.transferencias ENABLE ROW LEVEL SECURITY;

-- Policy for transferencias
CREATE POLICY "Users can manage their own transferencias" 
ON public.transferencias FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Add recurring templates table for automation
CREATE TABLE IF NOT EXISTS public.modelos_recorrentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  valor NUMERIC(15, 2) NOT NULL,
  dia_vencimento INTEGER CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  frequencia TEXT DEFAULT 'mensal' CHECK (frequencia IN ('mensal', 'semanal', 'anual')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  proxima_execucao DATE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for modelos_recorrentes
ALTER TABLE public.modelos_recorrentes ENABLE ROW LEVEL SECURITY;

-- Policy for modelos_recorrentes
CREATE POLICY "Users can manage their own modelos_recorrentes" 
ON public.modelos_recorrentes FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Trigger for update_at
CREATE TRIGGER update_modelos_recorrentes_updated_at BEFORE UPDATE ON public.modelos_recorrentes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();