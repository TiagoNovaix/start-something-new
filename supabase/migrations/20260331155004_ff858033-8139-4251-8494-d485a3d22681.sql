-- Create function to update reserva saldo_atual
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
    -- Calculation: Sum of all movimentacoes where tipo='entrada' minus Sum where tipo='saida'
    UPDATE public.reservas
    SET saldo_atual = COALESCE(
        (SELECT SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END)
         FROM public.movimentacoes_reservas
         WHERE reserva_id = target_reserva_id),
        0
    )
    WHERE id = target_reserva_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT, UPDATE, or DELETE on movimentacoes_reservas
DROP TRIGGER IF EXISTS update_reserva_saldo_trigger ON public.movimentacoes_reservas;
CREATE TRIGGER update_reserva_saldo_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.movimentacoes_reservas
FOR EACH ROW
EXECUTE FUNCTION public.update_reserva_saldo();

-- Create index for better performance of the SUM query
CREATE INDEX IF NOT EXISTS idx_movimentacoes_reservas_reserva_id ON public.movimentacoes_reservas(reserva_id);