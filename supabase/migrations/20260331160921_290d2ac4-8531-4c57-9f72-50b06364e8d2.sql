-- Drop and recreate the dashboard summary view with improved metrics and security_invoker
DROP VIEW IF EXISTS public.vw_dashboard_resumo;

CREATE VIEW public.vw_dashboard_resumo WITH (security_invoker = true) AS
SELECT 
    user_id,
    EXTRACT(MONTH FROM data) as mes,
    EXTRACT(YEAR FROM data) as ano,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' AND status = 'pago' THEN valor ELSE 0 END) as receita_paga,
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' AND status = 'pago' THEN valor ELSE 0 END) as despesa_paga,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' AND status = 'pendente' THEN valor ELSE 0 END) as receita_pendente,
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' AND status = 'pendente' THEN valor ELSE 0 END) as despesa_pendente,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' THEN valor ELSE 0 END) as receita_total,
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' THEN valor ELSE 0 END) as despesa_total,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' AND status = 'pago' THEN valor ELSE 0 END) - 
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' AND status = 'pago' THEN valor ELSE 0 END) as lucro_liquido_realizado
FROM 
    public.lancamentos
WHERE 
    deleted_at IS NULL
GROUP BY 
    user_id, EXTRACT(MONTH FROM data), EXTRACT(YEAR FROM data);

-- Create a view for the DRE (Profit and Loss statement)
DROP VIEW IF EXISTS public.vw_dre;

CREATE VIEW public.vw_dre WITH (security_invoker = true) AS
SELECT 
    l.user_id,
    EXTRACT(MONTH FROM l.data) as mes,
    EXTRACT(YEAR FROM l.data) as ano,
    c.classificacao_dre,
    c.subgrupo,
    c.nome as categoria_nome,
    l.tipo_movimentacao,
    SUM(l.valor) as valor_total
FROM 
    public.lancamentos l
JOIN 
    public.categorias c ON l.categoria_id = c.id
WHERE 
    l.deleted_at IS NULL
GROUP BY 
    l.user_id, EXTRACT(MONTH FROM l.data), EXTRACT(YEAR FROM l.data), c.classificacao_dre, c.subgrupo, c.nome, l.tipo_movimentacao;

-- Grant access to the views
GRANT SELECT ON public.vw_dashboard_resumo TO authenticated;
GRANT SELECT ON public.vw_dre TO authenticated;

-- Add performance indices if they don't exist
CREATE INDEX IF NOT EXISTS idx_lancamentos_status_data ON public.lancamentos(status, data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria_id ON public.lancamentos(categoria_id);