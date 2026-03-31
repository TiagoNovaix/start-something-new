-- Fix frequencia_recorrencia check constraint on lancamentos
ALTER TABLE public.lancamentos DROP CONSTRAINT IF EXISTS lancamentos_frequencia_recorrencia_check;
ALTER TABLE public.lancamentos ADD CONSTRAINT lancamentos_frequencia_recorrencia_check 
CHECK (frequencia_recorrencia = ANY (ARRAY['semanal'::text, 'quinzenal'::text, 'mensal'::text, 'bimestral'::text, 'trimestral'::text, 'semestral'::text, 'anual'::text, 'diario'::text]));

-- Add missing indices for performance
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id_data ON public.lancamentos(user_id, data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id_status ON public.lancamentos(user_id, status);
CREATE INDEX IF NOT EXISTS idx_lancamentos_user_id_tipo ON public.lancamentos(user_id, tipo_movimentacao);
CREATE INDEX IF NOT EXISTS idx_contas_user_id ON public.contas(user_id);
CREATE INDEX IF NOT EXISTS idx_categorias_user_id ON public.categorias(user_id);
CREATE INDEX IF NOT EXISTS idx_socios_user_id ON public.socios(user_id);
CREATE INDEX IF NOT EXISTS idx_reservas_user_id ON public.reservas(user_id);
CREATE INDEX IF NOT EXISTS idx_metas_user_id ON public.metas(user_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_user_id_mes_ano ON public.orcamentos(user_id, mes, ano);

-- Create a view for the dashboard summary
CREATE OR REPLACE VIEW public.vw_dashboard_resumo AS
SELECT 
    user_id,
    EXTRACT(MONTH FROM data) as mes,
    EXTRACT(YEAR FROM data) as ano,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' AND status = 'pago' THEN valor ELSE 0 END) as receita_total,
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' AND status = 'pago' THEN valor ELSE 0 END) as despesa_total,
    SUM(CASE WHEN tipo_movimentacao = 'Receita' AND status = 'pago' THEN valor ELSE 0 END) - 
    SUM(CASE WHEN tipo_movimentacao = 'Despesa' AND status = 'pago' THEN valor ELSE 0 END) as lucro_liquido
FROM 
    public.lancamentos
WHERE 
    deleted_at IS NULL
GROUP BY 
    user_id, EXTRACT(MONTH FROM data), EXTRACT(YEAR FROM data);

-- Grant access to the view
GRANT SELECT ON public.vw_dashboard_resumo TO authenticated;