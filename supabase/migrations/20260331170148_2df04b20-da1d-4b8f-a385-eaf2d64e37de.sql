-- Update the function to calculate reserve balances correctly
CREATE OR REPLACE FUNCTION public.update_reserva_saldo()
RETURNS TRIGGER AS $$
DECLARE
    target_reserva_id UUID;
BEGIN
    -- Identify the reserva_id to update
    IF (TG_OP = 'DELETE') THEN
        target_reserva_id = OLD.reserva_id;
    ELSE
        target_reserva_id = NEW.reserva_id;
    END IF;

    -- Update the saldo_atual in the target reserva
    -- Calculation: Sum of all movimentacoes (non-deleted) where tipo is an entry minus Sum where tipo is an exit
    UPDATE public.reservas
    SET saldo_atual = COALESCE(
        (SELECT SUM(CASE 
            WHEN tipo IN ('entrada', 'entrada_automatica') THEN valor 
            ELSE -valor 
         END)
         FROM public.movimentacoes_reservas
         WHERE reserva_id = target_reserva_id AND deleted_at IS NULL),
        0
    )
    WHERE id = target_reserva_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the handle_automatic_reserves function for better filtering
CREATE OR REPLACE FUNCTION public.handle_automatic_reserves()
RETURNS TRIGGER AS $$
BEGIN
    -- Remove old automatic movements if this is an update
    IF (TG_OP = 'UPDATE') THEN
        DELETE FROM public.movimentacoes_reservas 
        WHERE transacao_id = NEW.id AND tipo = 'entrada_automatica';
    END IF;

    -- Only process for non-deleted movements
    -- Check if it should be processed based on type and status
    -- Defaults to 'receita' if no specific origin type is set for the reserve
    IF (NEW.deleted_at IS NOT NULL OR NEW.status != 'pago') THEN
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
      AND (r.conta_id IS NULL OR r.conta_id = NEW.conta_id)
      AND r.deleted_at IS NULL
      AND r.status = 'ativa'
      -- Filter by specific categories if specified
      AND (
          r.categorias_especificas IS NULL OR 
          array_length(r.categorias_especificas, 1) IS NULL 
          OR NEW.categoria_id = ANY(r.categorias_especificas)
      )
      -- Filter by specific movement types if specified, default to 'receita' if empty
      AND (
          r.origem_tipo IS NULL OR 
          array_length(r.origem_tipo, 1) IS NULL 
          OR NEW.tipo_movimentacao = ANY(r.origem_tipo)
          OR (array_length(r.origem_tipo, 1) IS NULL AND NEW.tipo_movimentacao = 'receita')
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;