-- Add company_id to remaining tables
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.modelos_recorrentes ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.transferencias ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.monthly_closings ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.metas ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.configuracoes ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.regras_recorrencia ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.grupos_parcelas ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.movimentacoes_reservas ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.distribuicoes_lucro_itens ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Update RLS Policies for orcamentos
DROP POLICY IF EXISTS "Users can manage their own orçamentos" ON public.orcamentos;
CREATE POLICY "Users can manage company orçamentos" ON public.orcamentos
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for modelos_recorrentes
DROP POLICY IF EXISTS "Users can manage their own modelos_recorrentes" ON public.modelos_recorrentes;
CREATE POLICY "Users can manage company modelos_recorrentes" ON public.modelos_recorrentes
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for transferencias
DROP POLICY IF EXISTS "Users can manage their own transferencias" ON public.transferencias;
CREATE POLICY "Users can manage company transferencias" ON public.transferencias
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for monthly_closings
DROP POLICY IF EXISTS "Users can manage their own monthly_closings" ON public.monthly_closings;
CREATE POLICY "Users can manage company monthly_closings" ON public.monthly_closings
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for metas
DROP POLICY IF EXISTS "Users can manage their own metas" ON public.metas;
CREATE POLICY "Users can manage company metas" ON public.metas
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for configuracoes
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias configurações" ON public.configuracoes;
CREATE POLICY "Users can manage company configuracoes" ON public.configuracoes
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for regras_recorrencia
DROP POLICY IF EXISTS "Users can manage their own regras_recorrencia" ON public.regras_recorrencia;
CREATE POLICY "Users can manage company regras_recorrencia" ON public.regras_recorrencia
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for grupos_parcelas
DROP POLICY IF EXISTS "Users can manage their own grupos_parcelas" ON public.grupos_parcelas;
CREATE POLICY "Users can manage company grupos_parcelas" ON public.grupos_parcelas
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for movimentacoes_reservas
DROP POLICY IF EXISTS "Users can manage their own movimentacoes_reservas" ON public.movimentacoes_reservas;
CREATE POLICY "Users can manage company movimentacoes_reservas" ON public.movimentacoes_reservas
FOR ALL USING (public.check_user_company_access(company_id));

-- Update RLS Policies for distribuicoes_lucro_itens
DROP POLICY IF EXISTS "Users can manage their own distribuicoes_lucro_itens" ON public.distribuicoes_lucro_itens;
CREATE POLICY "Users can manage company distribuicoes_lucro_itens" ON public.distribuicoes_lucro_itens
FOR ALL USING (public.check_user_company_access(company_id));

-- Recreate vw_dre with company_id
DROP VIEW IF EXISTS public.vw_dre;
CREATE VIEW public.vw_dre AS
 SELECT l.company_id,
    l.user_id,
    EXTRACT(month FROM l.data) AS mes,
    EXTRACT(year FROM l.data) AS ano,
    c.classificacao_dre,
    c.subgrupo,
    c.nome AS categoria_nome,
    l.tipo_movimentacao,
    sum(l.valor) AS valor_total
   FROM (lancamentos l
     JOIN categorias c ON ((l.categoria_id = c.id)))
  WHERE (l.deleted_at IS NULL)
  GROUP BY l.company_id, l.user_id, (EXTRACT(month FROM l.data)), (EXTRACT(year FROM l.data)), c.classificacao_dre, c.subgrupo, c.nome, l.tipo_movimentacao;