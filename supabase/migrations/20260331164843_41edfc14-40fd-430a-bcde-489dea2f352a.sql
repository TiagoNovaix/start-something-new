-- Add missing columns to reservas
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
ADD COLUMN IF NOT EXISTS tipo TEXT CHECK (tipo IN ('imposto', 'emergencia', 'reinvestimento', 'expansao', 'outros')),
ADD COLUMN IF NOT EXISTS destino_contabil TEXT,
ADD COLUMN IF NOT EXISTS permite_saque_livre BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS categorias_especificas UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cor TEXT DEFAULT '#a400b6';

-- Add missing columns to movimentacoes_reservas
ALTER TABLE public.movimentacoes_reservas 
ADD COLUMN IF NOT EXISTS observacao TEXT;

-- Update RLS for reservas to be user-specific if not already
DROP POLICY IF EXISTS "Authenticated users can manage reservas" ON public.reservas;
CREATE POLICY "Users can manage their own reserves" ON public.reservas FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Ensure user_id is set for existing records
UPDATE public.reservas SET user_id = auth.uid() WHERE user_id IS NULL;
UPDATE public.movimentacoes_reservas SET user_id = auth.uid() WHERE user_id IS NULL;
