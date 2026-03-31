-- Update handle_automatic_reserves to be more robust
CREATE OR REPLACE FUNCTION public.handle_automatic_reserves()
RETURNS TRIGGER AS $$
BEGIN
    -- Remove old automatic movements if this is an update
    IF (TG_OP = 'UPDATE') THEN
        DELETE FROM public.movimentacoes_reservas 
        WHERE transacao_id = NEW.id AND tipo = 'entrada_automatica';
    END IF;

    -- Only process for non-deleted movements
    -- Check if it should be processed based on status
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
      -- Filter by specific movement types if specified, default to 'Receita' if empty
      -- Using UPPER for case-insensitive comparison
      AND (
          (r.origem_tipo IS NULL OR array_length(r.origem_tipo, 1) IS NULL) AND UPPER(NEW.tipo_movimentacao) = 'RECEITA'
          OR (array_length(r.origem_tipo, 1) > 0 AND UPPER(NEW.tipo_movimentacao) = ANY(
              SELECT UPPER(u) FROM unnest(r.origem_tipo) u
          ))
      )
      -- Avoid double-counting if a movement for this transaction and reserve already exists
      AND NOT EXISTS (
          SELECT 1 FROM public.movimentacoes_reservas m
          WHERE m.transacao_id = NEW.id AND m.reserva_id = r.id
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;