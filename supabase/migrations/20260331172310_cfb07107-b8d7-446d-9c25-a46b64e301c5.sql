-- Add centro_custo_id and subtipo to regras_recorrencia
ALTER TABLE public.regras_recorrencia 
ADD COLUMN IF NOT EXISTS centro_custo_id UUID REFERENCES public.centros_custo(id),
ADD COLUMN IF NOT EXISTS subtipo TEXT;

-- Add centro_custo_id to grupos_parcelas
ALTER TABLE public.grupos_parcelas 
ADD COLUMN IF NOT EXISTS centro_custo_id UUID REFERENCES public.centros_custo(id);

-- Update RLS policies for the new columns (they are already covered by user_id = auth.uid() usually, but let's be safe)
-- The existing policies for these tables already use user_id, so no changes needed for RLS.