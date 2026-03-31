-- Update policies for remaining core tables to respect soft-delete (deleted_at IS NULL)

-- 1. Lancamentos
DROP POLICY IF EXISTS "Users can manage their own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can manage their own lancamentos" ON public.lancamentos
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 2. Categorias
DROP POLICY IF EXISTS "Users can manage their own categorias" ON public.categorias;
CREATE POLICY "Users can manage their own categorias" ON public.categorias
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 3. Socios
DROP POLICY IF EXISTS "Users can manage their own socios" ON public.socios;
CREATE POLICY "Users can manage their own socios" ON public.socios
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 4. Contas
DROP POLICY IF EXISTS "Users can manage their own contas" ON public.contas;
CREATE POLICY "Users can manage their own contas" ON public.contas
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 5. Centros de Custo
DROP POLICY IF EXISTS "Users can manage their own centros_custo" ON public.centros_custo;
CREATE POLICY "Users can manage their own centros_custo" ON public.centros_custo
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 6. Movimentacoes Reservas
DROP POLICY IF EXISTS "Users can view their own reserve movements" ON public.movimentacoes_reservas;
CREATE POLICY "Users can view their own reserve movements" ON public.movimentacoes_reservas
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can create their own reserve movements" ON public.movimentacoes_reservas;
CREATE POLICY "Users can create their own reserve movements" ON public.movimentacoes_reservas
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reserve movements" ON public.movimentacoes_reservas;
CREATE POLICY "Users can delete their own reserve movements" ON public.movimentacoes_reservas
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 7. Configuracoes
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias configurações" ON public.configuracoes;
DROP POLICY IF EXISTS "Users can manage their own configuracoes" ON public.configuracoes;
CREATE POLICY "Users can manage their own configuracoes" ON public.configuracoes
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- 8. Regras Recorrencia (complete missing policies)
DROP POLICY IF EXISTS "Users can create their own recurring rules" ON public.regras_recorrencia;
CREATE POLICY "Users can create their own recurring rules" ON public.regras_recorrencia
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own recurring rules" ON public.regras_recorrencia;
CREATE POLICY "Users can update their own recurring rules" ON public.regras_recorrencia
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own recurring rules" ON public.regras_recorrencia;
CREATE POLICY "Users can delete their own recurring rules" ON public.regras_recorrencia
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 9. Grupos Parcelas (complete missing policies)
DROP POLICY IF EXISTS "Users can create their own installment groups" ON public.grupos_parcelas;
CREATE POLICY "Users can create their own installment groups" ON public.grupos_parcelas
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own installment groups" ON public.grupos_parcelas;
CREATE POLICY "Users can delete their own installment groups" ON public.grupos_parcelas
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Add missing performance indexes
CREATE INDEX IF NOT EXISTS idx_categorias_deleted_at ON public.categorias(deleted_at);
CREATE INDEX IF NOT EXISTS idx_socios_deleted_at ON public.socios(deleted_at);
CREATE INDEX IF NOT EXISTS idx_contas_deleted_at ON public.contas(deleted_at);
CREATE INDEX IF NOT EXISTS idx_centros_custo_deleted_at ON public.centros_custo(deleted_at);
