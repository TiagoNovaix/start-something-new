-- Create a function to sync reserve balance
CREATE OR REPLACE FUNCTION public.sync_reserva_saldo(target_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.reservas
    SET saldo_atual = COALESCE((
        SELECT SUM(
            CASE 
                WHEN tipo = 'entrada' THEN valor 
                WHEN tipo = 'saida' THEN -valor 
                ELSE 0 
            END)
        FROM public.movimentacoes_reservas
        WHERE reserva_id = target_id 
          AND deleted_at IS NULL
    ), 0)
    WHERE id = target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to handle reserve movement changes
CREATE OR REPLACE FUNCTION public.update_reserva_saldo()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        IF OLD.reserva_id IS NOT NULL THEN
            PERFORM public.sync_reserva_saldo(OLD.reserva_id);
        END IF;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF OLD.reserva_id IS NOT NULL THEN
            PERFORM public.sync_reserva_saldo(OLD.reserva_id);
        END IF;
        IF NEW.reserva_id IS NOT NULL AND NEW.reserva_id != OLD.reserva_id THEN
            PERFORM public.sync_reserva_saldo(NEW.reserva_id);
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        IF NEW.reserva_id IS NOT NULL THEN
            PERFORM public.sync_reserva_saldo(NEW.reserva_id);
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for reserve movements
DROP TRIGGER IF EXISTS trigger_update_reserva_saldo ON public.movimentacoes_reservas;
CREATE TRIGGER trigger_update_reserva_saldo
AFTER INSERT OR UPDATE OR DELETE ON public.movimentacoes_reservas
FOR EACH ROW
EXECUTE FUNCTION public.update_reserva_saldo();

-- Re-create the account balance sync trigger with fixed syntax
DROP TRIGGER IF EXISTS trigger_update_conta_saldo ON public.lancamentos;
CREATE TRIGGER trigger_update_conta_saldo
AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_conta_saldo();

-- Initial sync for all reserves
UPDATE public.reservas r
SET saldo_atual = COALESCE((
    SELECT SUM(
        CASE 
            WHEN tipo = 'entrada' THEN valor 
            WHEN tipo = 'saida' THEN -valor 
            ELSE 0 
        END)
    FROM public.movimentacoes_reservas
    WHERE reserva_id = r.id 
      AND deleted_at IS NULL
), 0);

-- Initial sync for all accounts
UPDATE public.contas c
SET saldo_atual = COALESCE(saldo_inicial, 0) + COALESCE(
    (SELECT SUM(
        CASE 
            WHEN conta_id = c.id AND tipo_movimentacao = 'Receita' THEN valor 
            WHEN conta_id = c.id AND tipo_movimentacao = 'Despesa' THEN -valor 
            WHEN conta_id = c.id AND tipo_movimentacao = 'Transferência' THEN -valor 
            WHEN conta_destino_id = c.id THEN valor 
            ELSE 0 
        END)
     FROM public.lancamentos
     WHERE (conta_id = c.id OR conta_destino_id = c.id)
       AND status = 'pago' 
       AND deleted_at IS NULL),
    0
);