-- Add company_id to core tables
ALTER TABLE public.contas ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.categorias ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.centros_custo ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.socios ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.distribuicoes_lucro ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Create a helper function to check company membership
CREATE OR REPLACE FUNCTION public.check_user_company_access(check_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE company_id = check_company_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS Policies for contas
DROP POLICY IF EXISTS "Users can manage their own contas" ON public.contas;
CREATE POLICY "Users can manage company contas" ON public.contas
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for categorias
DROP POLICY IF EXISTS "Users can manage their own categorias" ON public.categorias;
CREATE POLICY "Users can manage company categorias" ON public.categorias
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for lancamentos
DROP POLICY IF EXISTS "Users can manage their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can manage company lancamentos" ON public.lancamentos
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for reservas
DROP POLICY IF EXISTS "Users can manage their own reservas" ON public.reservas;
CREATE POLICY "Users can manage company reservas" ON public.reservas
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for socios
DROP POLICY IF EXISTS "Users can manage their own socios" ON public.socios;
CREATE POLICY "Users can manage company socios" ON public.socios
FOR ALL USING (public.check_user_company_access(company_id));

-- Recreate vw_dashboard_resumo with company_id
DROP VIEW IF EXISTS public.vw_dashboard_resumo;
CREATE VIEW public.vw_dashboard_resumo AS
 SELECT lancamentos.company_id,
    lancamentos.user_id,
    EXTRACT(month FROM lancamentos.data) AS mes,
    EXTRACT(year FROM lancamentos.data) AS ano,
    sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Receita'::text) AND (lancamentos.status = 'pago'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS receita_paga,
    sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Despesa'::text) AND (lancamentos.status = 'pago'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS despesa_paga,
    sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Receita'::text) AND (lancamentos.status = 'pendente'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS receita_pendente,
    sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Despesa'::text) AND (lancamentos.status = 'pendente'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS despesa_pendente,
    sum(
        CASE
            WHEN (lancamentos.tipo_movimentacao = 'Receita'::text) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS receita_total,
    sum(
        CASE
            WHEN (lancamentos.tipo_movimentacao = 'Despesa'::text) THEN lancamentos.valor
            ELSE (0)::numeric
        END) AS despesa_total,
    (sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Receita'::text) AND (lancamentos.status = 'pago'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END) - sum(
        CASE
            WHEN ((lancamentos.tipo_movimentacao = 'Despesa'::text) AND (lancamentos.status = 'pago'::text)) THEN lancamentos.valor
            ELSE (0)::numeric
        END)) AS lucro_liquido_realizado
   FROM lancamentos
  WHERE (lancamentos.deleted_at IS NULL)
  GROUP BY lancamentos.company_id, lancamentos.user_id, (EXTRACT(month FROM lancamentos.data)), (EXTRACT(year FROM lancamentos.data));