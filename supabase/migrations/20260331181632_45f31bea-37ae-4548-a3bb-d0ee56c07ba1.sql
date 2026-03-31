-- Fix search path for all functions
ALTER FUNCTION public.set_user_id() SET search_path = public;
ALTER FUNCTION public.update_reserva_saldo() SET search_path = public;
ALTER FUNCTION public.handle_automatic_reserves() SET search_path = public;
ALTER FUNCTION public.update_conta_saldo() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.sync_reserva_saldo(uuid) SET search_path = public;
ALTER FUNCTION public.sync_conta_saldo(uuid) SET search_path = public;

-- Fix overly permissive policy for companies
-- Instead of WITH CHECK (true), we should at least check if the user is authenticated
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
CREATE POLICY "Users can create companies" ON public.companies
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure all views use security_invoker = true
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