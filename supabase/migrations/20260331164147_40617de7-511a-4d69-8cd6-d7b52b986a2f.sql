-- Create the handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for each table that has an updated_at column
DROP TRIGGER IF EXISTS update_categorias_updated_at ON public.categorias;
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_centros_custo_updated_at ON public.centros_custo;
CREATE TRIGGER update_centros_custo_updated_at BEFORE UPDATE ON public.centros_custo FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_configuracoes_updated_at ON public.configuracoes;
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.configuracoes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_contas_updated_at ON public.contas;
CREATE TRIGGER update_contas_updated_at BEFORE UPDATE ON public.contas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_grupos_parcelas_updated_at ON public.grupos_parcelas;
CREATE TRIGGER update_grupos_parcelas_updated_at BEFORE UPDATE ON public.grupos_parcelas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_lancamentos_updated_at ON public.lancamentos;
CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_metas_updated_at ON public.metas;
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON public.metas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_modelos_recorrentes_updated_at ON public.modelos_recorrentes;
CREATE TRIGGER update_modelos_recorrentes_updated_at BEFORE UPDATE ON public.modelos_recorrentes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_orcamentos_updated_at ON public.orcamentos;
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_regras_recorrencia_updated_at ON public.regras_recorrencia;
CREATE TRIGGER update_regras_recorrencia_updated_at BEFORE UPDATE ON public.regras_recorrencia FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_reservas_updated_at ON public.reservas;
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON public.reservas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_socios_updated_at ON public.socios;
CREATE TRIGGER update_socios_updated_at BEFORE UPDATE ON public.socios FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();