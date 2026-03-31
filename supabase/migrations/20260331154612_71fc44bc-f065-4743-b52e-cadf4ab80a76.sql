ALTER TABLE public.lancamentos ADD COLUMN data_vencimento DATE;
ALTER TABLE public.lancamentos ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create an index for deleted_at to optimize queries that filter it out
CREATE INDEX idx_lancamentos_deleted_at ON public.lancamentos (deleted_at) WHERE deleted_at IS NULL;