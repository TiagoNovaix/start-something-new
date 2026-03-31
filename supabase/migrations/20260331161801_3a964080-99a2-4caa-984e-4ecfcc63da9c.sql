-- Add soft-delete support (deleted_at) to remaining core tables for consistency
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.metas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.transferencias ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.grupos_parcelas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.regras_recorrencia ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.movimentacoes_reservas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.fechamentos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.modelos_recorrentes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.configuracoes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indices for better performance on soft-delete queries
CREATE INDEX IF NOT EXISTS idx_reservas_deleted_at ON public.reservas(deleted_at);
CREATE INDEX IF NOT EXISTS idx_metas_deleted_at ON public.metas(deleted_at);
CREATE INDEX IF NOT EXISTS idx_transferencias_deleted_at ON public.transferencias(deleted_at);
CREATE INDEX IF NOT EXISTS idx_orcamentos_deleted_at ON public.orcamentos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_grupos_parcelas_deleted_at ON public.grupos_parcelas(deleted_at);
CREATE INDEX IF NOT EXISTS idx_regras_recorrencia_deleted_at ON public.regras_recorrencia(deleted_at);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_reservas_deleted_at ON public.movimentacoes_reservas(deleted_at);
CREATE INDEX IF NOT EXISTS idx_fechamentos_deleted_at ON public.fechamentos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_modelos_recorrentes_deleted_at ON public.modelos_recorrentes(deleted_at);
CREATE INDEX IF NOT EXISTS idx_configuracoes_deleted_at ON public.configuracoes(deleted_at);

-- Update RLS policies to automatically exclude deleted items (optional but recommended)
-- Note: Existing policies like (auth.uid() = user_id) will still work, but adding (deleted_at IS NULL)
-- ensures that standard queries don't see deleted data unless explicitly requested.

-- Reservas
DROP POLICY IF EXISTS "Users can manage their own reservas" ON public.reservas;
CREATE POLICY "Users can manage their own reservas" ON public.reservas
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Metas
DROP POLICY IF EXISTS "Users can manage their own metas" ON public.metas;
CREATE POLICY "Users can manage their own metas" ON public.metas
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Transferencias
DROP POLICY IF EXISTS "Users can manage their own transferencias" ON public.transferencias;
CREATE POLICY "Users can manage their own transferencias" ON public.transferencias
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Orcamentos
DROP POLICY IF EXISTS "Users can manage their own orçamentos" ON public.orcamentos;
CREATE POLICY "Users can manage their own orçamentos" ON public.orcamentos
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Grupos Parcelas
DROP POLICY IF EXISTS "Users can view their own installment groups" ON public.grupos_parcelas;
CREATE POLICY "Users can view their own installment groups" ON public.grupos_parcelas
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can update their own installment groups" ON public.grupos_parcelas;
CREATE POLICY "Users can update their own installment groups" ON public.grupos_parcelas
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Regras Recorrencia
DROP POLICY IF EXISTS "Users can view their own recurring rules" ON public.regras_recorrencia;
CREATE POLICY "Users can view their own recurring rules" ON public.regras_recorrencia
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Fechamentos
DROP POLICY IF EXISTS "Users can manage their own fechamentos" ON public.fechamentos;
CREATE POLICY "Users can manage their own fechamentos" ON public.fechamentos
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Modelos Recorrentes
DROP POLICY IF EXISTS "Users can manage their own modelos_recorrentes" ON public.modelos_recorrentes;
CREATE POLICY "Users can manage their own modelos_recorrentes" ON public.modelos_recorrentes
    FOR ALL TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);
