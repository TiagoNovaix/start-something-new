-- Create installment_groups table
CREATE TABLE public.grupos_parcelas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_parcelas INTEGER NOT NULL,
    valor_total NUMERIC(15, 2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recurring_rules table
CREATE TABLE public.regras_recorrencia (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    frequencia TEXT NOT NULL, -- mensal, semanal, quinzenal, anual
    data_inicio DATE NOT NULL,
    data_fim DATE,
    valor NUMERIC(15, 2),
    descricao TEXT,
    categoria_id UUID REFERENCES public.categorias(id),
    conta_id UUID REFERENCES public.contas(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to lancamentos
ALTER TABLE public.lancamentos
ADD COLUMN IF NOT EXISTS grupo_parcelas_id UUID REFERENCES public.grupos_parcelas(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS regra_recorrencia_id UUID REFERENCES public.regras_recorrencia(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subtipo TEXT;

-- Add missing columns to reservas
ALTER TABLE public.reservas
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativa',
ADD COLUMN IF NOT EXISTS automatico BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS percentual NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS origem_tipo TEXT[]; -- Array of category classification or types

-- Create reserve_movements table
CREATE TABLE public.movimentacoes_reservas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reserva_id UUID NOT NULL REFERENCES public.reservas(id) ON DELETE CASCADE,
    transacao_id UUID REFERENCES public.lancamentos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL, -- entrada_automatica, etc
    valor NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.grupos_parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_recorrencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_reservas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own installment groups" ON public.grupos_parcelas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own installment groups" ON public.grupos_parcelas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own installment groups" ON public.grupos_parcelas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own installment groups" ON public.grupos_parcelas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recurring rules" ON public.regras_recorrencia FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own recurring rules" ON public.regras_recorrencia FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own recurring rules" ON public.regras_recorrencia FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recurring rules" ON public.regras_recorrencia FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reserve movements" ON public.movimentacoes_reservas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reserve movements" ON public.movimentacoes_reservas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reserve movements" ON public.movimentacoes_reservas FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_grupos_parcelas_updated_at BEFORE UPDATE ON public.grupos_parcelas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regras_recorrencia_updated_at BEFORE UPDATE ON public.regras_recorrencia FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();