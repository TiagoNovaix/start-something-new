-- Create a secure function to check if a user is an admin of a company
CREATE OR REPLACE FUNCTION public.check_user_is_company_admin(check_company_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE company_id = check_company_id
        AND user_id = auth.uid()
        AND role = 'admin'
    );
END;
$$;

-- Fix the search path for the existing access check function
ALTER FUNCTION public.check_user_company_access(uuid) SET search_path = public;

-- Fix infinite recursion in users_companies RLS
DROP POLICY IF EXISTS "Admins can manage company memberships" ON public.users_companies;
CREATE POLICY "Admins can manage company memberships" ON public.users_companies
FOR ALL USING (public.check_user_is_company_admin(company_id));

-- Consolidate bank_accounts RLS to use the standard helper
DROP POLICY IF EXISTS "Users can view bank accounts of their companies" ON public.bank_accounts;
DROP POLICY IF EXISTS "Admins can manage bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can manage company bank_accounts" ON public.bank_accounts
FOR ALL USING (public.check_user_company_access(company_id));

-- Recreate views with security_invoker = true for better security and performance
DROP VIEW IF EXISTS public.vw_dashboard_resumo;
CREATE VIEW public.vw_dashboard_resumo WITH (security_invoker = true) AS
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
   FROM public.lancamentos
  WHERE (lancamentos.deleted_at IS NULL)
  GROUP BY lancamentos.company_id, lancamentos.user_id, (EXTRACT(month FROM lancamentos.data)), (EXTRACT(year FROM lancamentos.data));

DROP VIEW IF EXISTS public.vw_dre;
CREATE VIEW public.vw_dre WITH (security_invoker = true) AS
SELECT l.company_id,
    l.user_id,
    EXTRACT(month FROM l.data) AS mes,
    EXTRACT(year FROM l.data) AS ano,
    c.classificacao_dre,
    c.subgrupo,
    c.nome AS categoria_nome,
    l.tipo_movimentacao,
    sum(l.valor) AS valor_total
   FROM (public.lancamentos l
     JOIN public.categorias c ON ((l.categoria_id = c.id)))
  WHERE (l.deleted_at IS NULL)
  GROUP BY l.company_id, l.user_id, (EXTRACT(month FROM l.data)), (EXTRACT(year FROM l.data)), c.classificacao_dre, c.subgrupo, c.nome, l.tipo_movimentacao;

-- Clean up the redundant partners table
DROP TABLE IF EXISTS public.partners CASCADE;
