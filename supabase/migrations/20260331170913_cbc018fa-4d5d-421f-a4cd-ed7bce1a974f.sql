-- Add saldo_atual column to contas
ALTER TABLE public.contas ADD COLUMN IF NOT EXISTS saldo_atual NUMERIC(12, 2) DEFAULT 0;

-- Function to update account balance
CREATE OR REPLACE FUNCTION public.update_conta_saldo()
RETURNS TRIGGER AS $$
DECLARE
    target_conta_id UUID;
BEGIN
    -- Identify the account to update
    IF (TG_OP = 'DELETE') THEN
        target_conta_id = OLD.conta_id;
    ELSE
        target_conta_id = NEW.conta_id;
    END IF;

    -- Update the saldo_atual in the target account
    -- Calculation: saldo_inicial + (Sum of Receipts) - (Sum of Expenses)
    -- Only for 'pago' status and non-deleted
    UPDATE public.contas
    SET saldo_atual = COALESCE(saldo_inicial, 0) + COALESCE(
        (SELECT SUM(
            CASE 
                WHEN tipo_movimentacao = 'Receita' THEN valor 
                WHEN tipo_movimentacao = 'Despesa' THEN -valor 
                ELSE 0 
            END)
         FROM public.lancamentos
         WHERE conta_id = target_conta_id 
           AND status = 'pago' 
           AND deleted_at IS NULL),
        0
    )
    WHERE id = target_conta_id;

    -- If it's a transfer, we might need to update the destination account too
    -- But since transfers usually create two records or have a conta_destino_id, 
    -- we handle the conta_destino_id if it exists.
    
    IF (TG_OP != 'DELETE' AND NEW.conta_destino_id IS NOT NULL) THEN
        UPDATE public.contas
        SET saldo_atual = COALESCE(saldo_inicial, 0) + COALESCE(
            (SELECT SUM(
                CASE 
                    WHEN tipo_movimentacao = 'Receita' THEN valor 
                    WHEN tipo_movimentacao = 'Despesa' THEN -valor 
                    WHEN conta_destino_id = id THEN valor -- Handle incoming transfer
                    ELSE 0 
                END)
             FROM public.lancamentos
             WHERE (conta_id = id OR conta_destino_id = id)
               AND status = 'pago' 
               AND deleted_at IS NULL),
            0
        )
        WHERE id = NEW.conta_destino_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for account balance update
DROP TRIGGER IF EXISTS trigger_update_conta_saldo ON public.lancamentos;
CREATE TRIGGER trigger_update_conta_saldo
AFTER INSERT OR UPDATE OR DELETE ON public.lancamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_conta_saldo();

-- Initial sync for existing accounts
UPDATE public.contas c
SET saldo_atual = COALESCE(saldo_inicial, 0) + COALESCE(
    (SELECT SUM(
        CASE 
            WHEN tipo_movimentacao = 'Receita' THEN valor 
            WHEN tipo_movimentacao = 'Despesa' THEN -valor 
            WHEN conta_destino_id = c.id THEN valor -- Incoming transfer
            WHEN conta_id = c.id AND tipo_movimentacao = 'Transferência' THEN -valor -- Outgoing transfer
            ELSE 0 
        END)
     FROM public.lancamentos
     WHERE (conta_id = c.id OR conta_destino_id = c.id)
       AND status = 'pago' 
       AND deleted_at IS NULL),
    0
);