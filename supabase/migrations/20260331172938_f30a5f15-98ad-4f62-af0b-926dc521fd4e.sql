-- Update socios table
ALTER TABLE public.socios ADD COLUMN IF NOT EXISTS pro_labore NUMERIC DEFAULT 0;

-- Update configuracoes table
ALTER TABLE public.configuracoes ADD COLUMN IF NOT EXISTS caixa_operacional_minimo_meses INTEGER DEFAULT 1;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    socio_id UUID REFERENCES public.socios(id),
    tipo_evento TEXT NOT NULL,
    valor_antigo JSONB,
    valor_novo JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" 
ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audit logs" 
ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create distribuicoes_lucro table
CREATE TABLE IF NOT EXISTS public.distribuicoes_lucro (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    mes_referencia DATE NOT NULL,
    total_distribuido NUMERIC NOT NULL DEFAULT 0,
    receita_bruta NUMERIC NOT NULL DEFAULT 0,
    despesas_operacionais NUMERIC NOT NULL DEFAULT 0,
    ebitda NUMERIC NOT NULL DEFAULT 0,
    impostos NUMERIC NOT NULL DEFAULT 0,
    financeiro NUMERIC NOT NULL DEFAULT 0,
    lucro_liquido NUMERIC NOT NULL DEFAULT 0,
    pro_labore_total NUMERIC NOT NULL DEFAULT 0,
    reservas_provisionadas NUMERIC NOT NULL DEFAULT 0,
    disponivel_distribuicao NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for distribuicoes_lucro
ALTER TABLE public.distribuicoes_lucro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own distributions" 
ON public.distribuicoes_lucro FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own distributions" 
ON public.distribuicoes_lucro FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create distribuicoes_lucro_itens table
CREATE TABLE IF NOT EXISTS public.distribuicoes_lucro_itens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    distribuicao_id UUID NOT NULL REFERENCES public.distribuicoes_lucro(id) ON DELETE CASCADE,
    socio_id UUID NOT NULL REFERENCES public.socios(id),
    percentual_societario NUMERIC NOT NULL,
    valor_recebido NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for distribuicoes_lucro_itens
ALTER TABLE public.distribuicoes_lucro_itens ENABLE ROW LEVEL SECURITY;

-- No direct RLS on items, usually we'd join but to keep it simple and safe:
CREATE POLICY "Users can view their own distribution items" 
ON public.distribuicoes_lucro_itens FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.distribuicoes_lucro d WHERE d.id = distribuicao_id AND d.user_id = auth.uid())
);

CREATE POLICY "Users can insert their own distribution items" 
ON public.distribuicoes_lucro_itens FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.distribuicoes_lucro d WHERE d.id = distribuicao_id AND d.user_id = auth.uid())
);

-- Trigger to update updated_at on distribuicoes_lucro
CREATE TRIGGER update_distribuicoes_lucro_updated_at
BEFORE UPDATE ON public.distribuicoes_lucro
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
