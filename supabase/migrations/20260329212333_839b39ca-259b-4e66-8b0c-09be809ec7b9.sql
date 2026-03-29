-- Fix overly permissive RLS on profiles
DROP POLICY IF EXISTS "System can create profiles" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Add some common missing columns to profiles if not already there
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add metadata column to lancamentos for extra information
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Ensure all tables have updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to lancamentos if it doesn't exist
DROP TRIGGER IF EXISTS update_lancamentos_updated_at ON public.lancamentos;
CREATE TRIGGER update_lancamentos_updated_at
  BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();