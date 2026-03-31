-- Function to handle automatic reserve allocation from income
CREATE OR REPLACE FUNCTION public.handle_automatic_reserves()
RETURNS TRIGGER AS $$
BEGIN
    -- Remove old automatic movements if this is an update
    IF (TG_OP = 'UPDATE') THEN
        DELETE FROM public.movimentacoes_reservas 
        WHERE transacao_id = NEW.id AND tipo = 'entrada_automatica';
    END IF;

    -- Only process for non-deleted income (receita)
    IF (NEW.deleted_at IS NOT NULL OR NEW.tipo_movimentacao != 'receita') THEN
        RETURN NEW;
    END IF;

    -- Create movements for all matching automatic reserves
    INSERT INTO public.movimentacoes_reservas (
        user_id,
        reserva_id,
        transacao_id,
        tipo,
        valor,
        observacao
    )
    SELECT 
        NEW.user_id,
        r.id,
        NEW.id,
        'entrada_automatica',
        (NEW.valor * r.percentual / 100),
        'Alocação automática de: ' || NEW.descricao
    FROM public.reservas r
    WHERE r.user_id = NEW.user_id 
      AND r.automatico = true 
      AND r.conta_id = NEW.conta_id
      AND r.deleted_at IS NULL
      -- Filter by category if specified
      AND (
          array_length(r.categorias_especificas, 1) IS NULL 
          OR NEW.categoria_id = ANY(r.categorias_especificas)
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for automatic reserve allocation
DROP TRIGGER IF EXISTS trigger_handle_automatic_reserves ON public.lancamentos;
CREATE TRIGGER trigger_handle_automatic_reserves
AFTER INSERT OR UPDATE ON public.lancamentos
FOR EACH ROW
EXECUTE FUNCTION public.handle_automatic_reserves();