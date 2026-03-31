-- Improved function to update account balance
CREATE OR REPLACE FUNCTION public.update_conta_saldo()
RETURNS TRIGGER AS $$
DECLARE
    old_origin_id UUID;
    new_origin_id UUID;
    old_dest_id UUID;
    new_dest_id UUID;
BEGIN
    -- Capture relevant account IDs based on operation
    IF (TG_OP = 'DELETE') THEN
        old_origin_id := OLD.conta_id;
        old_dest_id := OLD.conta_destino_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        old_origin_id := OLD.conta_id;
        old_dest_id := OLD.conta_destino_id;
        new_origin_id := NEW.conta_id;
        new_dest_id := NEW.conta_destino_id;
    ELSIF (TG_OP = 'INSERT') THEN
        new_origin_id := NEW.conta_id;
        new_dest_id := NEW.conta_destino_id;
    END IF;

    -- Update all affected accounts
    -- Origin accounts (old and new)
    IF old_origin_id IS NOT NULL THEN
        PERFORM public.sync_conta_saldo(old_origin_id);
    END IF;
    IF new_origin_id IS NOT NULL AND (old_origin_id IS NULL OR new_origin_id != old_origin_id) THEN
        PERFORM public.sync_conta_saldo(new_origin_id);
    END IF;

    -- Destination accounts (old and new)
    IF old_dest_id IS NOT NULL THEN
        PERFORM public.sync_conta_saldo(old_dest_id);
    END IF;
    IF new_dest_id IS NOT NULL AND (old_dest_id IS NULL OR new_dest_id != old_dest_id) THEN
        PERFORM public.sync_conta_saldo(new_dest_id);
    END IF;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function to sync a specific account's balance
CREATE OR REPLACE FUNCTION public.sync_conta_saldo(target_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.contas
    SET saldo_atual = COALESCE(saldo_inicial, 0) + COALESCE(
        (SELECT SUM(
            CASE 
                WHEN conta_id = target_id AND tipo_movimentacao = 'Receita' THEN valor 
                WHEN conta_id = target_id AND tipo_movimentacao = 'Despesa' THEN -valor 
                WHEN conta_id = target_id AND tipo_movimentacao = 'Transferência' THEN -valor 
                WHEN conta_destino_id = target_id THEN valor 
                ELSE 0 
            END)
         FROM public.lancamentos
         WHERE (conta_id = target_id OR conta_destino_id = target_id)
           AND status = 'pago' 
           AND deleted_at IS NULL),
        0
    )
    WHERE id = target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists and is correctly configured
DROP TRIGGER IF EXISTS trigger_update_conta_saldo ON public.lancamentos;
CREATE TRIGGER trigger_update_conta_saldo
AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_conta_saldo();

-- Final sync for all accounts to ensure consistency
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