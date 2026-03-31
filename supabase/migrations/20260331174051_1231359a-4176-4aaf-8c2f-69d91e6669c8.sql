-- Rename table
ALTER TABLE IF EXISTS public.fechamentos RENAME TO monthly_closings;

-- Update columns for monthly_closings
ALTER TABLE public.monthly_closings 
  ADD COLUMN IF NOT EXISTS snapshot_dre JSONB,
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS closed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS justification TEXT;

-- Update status constraint
ALTER TABLE public.monthly_closings 
  DROP CONSTRAINT IF EXISTS fechamentos_status_check;

ALTER TABLE public.monthly_closings 
  ADD CONSTRAINT monthly_closings_status_check 
  CHECK (status IN ('aberto', 'em_conferencia', 'fechado', 'reaberto'));

-- Set default status
ALTER TABLE public.monthly_closings 
  ALTER COLUMN status SET DEFAULT 'aberto';

-- Add role to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Add justification to audit_logs
ALTER TABLE public.audit_logs 
  ADD COLUMN IF NOT EXISTS justification TEXT;

-- Update RLS for monthly_closings
ALTER TABLE public.monthly_closings ENABLE ROW LEVEL SECURITY;

-- If policy exists, drop and recreate
DROP POLICY IF EXISTS "Authenticated users can manage fechamentos" ON public.monthly_closings;
DROP POLICY IF EXISTS "Authenticated users can manage monthly_closings" ON public.monthly_closings;

CREATE POLICY "Authenticated users can manage monthly_closings" 
ON public.monthly_closings 
FOR ALL TO authenticated 
USING (true);

-- Function to check if a month is closed
CREATE OR REPLACE FUNCTION public.is_month_closed(target_month INTEGER, target_year INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.monthly_closings 
    WHERE mes = target_month AND ano = target_year AND status = 'fechado'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
