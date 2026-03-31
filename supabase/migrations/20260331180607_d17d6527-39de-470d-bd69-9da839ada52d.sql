-- Add company_id to documents and vector_soluv
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.vector_soluv ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Consolidate RLS for documents
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage company documents" ON public.documents
FOR ALL USING (public.check_user_company_access(company_id));

-- Consolidate RLS for vector_soluv
DROP POLICY IF EXISTS "Users can view their own vector_soluv" ON public.vector_soluv;
DROP POLICY IF EXISTS "Users can create their own vector_soluv" ON public.vector_soluv;
DROP POLICY IF EXISTS "Users can update their own vector_soluv" ON public.vector_soluv;
DROP POLICY IF EXISTS "Users can delete their own vector_soluv" ON public.vector_soluv;
ALTER TABLE public.vector_soluv ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage company vector_soluv" ON public.vector_soluv
FOR ALL USING (public.check_user_company_access(company_id));

-- Clean up redundant policies for movimentacoes_reservas
DROP POLICY IF EXISTS "Users can view their own reserve movements" ON public.movimentacoes_reservas;
DROP POLICY IF EXISTS "Users can create their own reserve movements" ON public.movimentacoes_reservas;
DROP POLICY IF EXISTS "Users can delete their own reserve movements" ON public.movimentacoes_reservas;

-- Clean up redundant policies for grupos_parcelas
DROP POLICY IF EXISTS "Users can view their own installment groups" ON public.grupos_parcelas;
DROP POLICY IF EXISTS "Users can update their own installment groups" ON public.grupos_parcelas;
DROP POLICY IF EXISTS "Users can create their own installment groups" ON public.grupos_parcelas;
DROP POLICY IF EXISTS "Users can delete their own installment groups" ON public.grupos_parcelas;

-- Clean up redundant policies for regras_recorrencia
DROP POLICY IF EXISTS "Users can view their own recurring rules" ON public.regras_recorrencia;
DROP POLICY IF EXISTS "Users can create their own recurring rules" ON public.regras_recorrencia;
DROP POLICY IF EXISTS "Users can update their own recurring rules" ON public.regras_recorrencia;
DROP POLICY IF EXISTS "Users can delete their own recurring rules" ON public.regras_recorrencia;

-- Clean up redundant policies for monthly_closings
DROP POLICY IF EXISTS "Users can manage their own fechamentos" ON public.monthly_closings;
DROP POLICY IF EXISTS "Authenticated users can manage monthly_closings" ON public.monthly_closings;

-- Clean up redundant policies for centros_custo
DROP POLICY IF EXISTS "Users can manage their own centros_custo" ON public.centros_custo;
CREATE POLICY "Users can manage company centros_custo" ON public.centros_custo
FOR ALL USING (public.check_user_company_access(company_id));

-- Clean up redundant policies for configuracoes
DROP POLICY IF EXISTS "Users can manage their own configuracoes" ON public.configuracoes;

-- Clean up redundant policies for reservas
DROP POLICY IF EXISTS "Users can manage their own reserves" ON public.reservas;

-- Clean up redundant policies for audit_logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can create their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can manage company audit_logs" ON public.audit_logs
FOR ALL USING (public.check_user_company_access(company_id));

-- Clean up redundant policies for distribuicoes_lucro
DROP POLICY IF EXISTS "Users can view their own distributions" ON public.distribuicoes_lucro;
DROP POLICY IF EXISTS "Users can create their own distributions" ON public.distribuicoes_lucro;
CREATE POLICY "Users can manage company distribuicoes_lucro" ON public.distribuicoes_lucro
FOR ALL USING (public.check_user_company_access(company_id));

-- Clean up redundant policies for distribuicoes_lucro_itens
DROP POLICY IF EXISTS "Users can view their own distribution items" ON public.distribuicoes_lucro_itens;
DROP POLICY IF EXISTS "Users can insert their own distribution items" ON public.distribuicoes_lucro_itens;
