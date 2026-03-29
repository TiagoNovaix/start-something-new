-- Add user_id to tables that don't have it
ALTER TABLE public.socios ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.categorias ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();
ALTER TABLE public.reservas ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

-- Drop existing broad policies
DROP POLICY IF EXISTS "Authenticated users can manage socios" ON public.socios;
DROP POLICY IF EXISTS "Authenticated users can manage categorias" ON public.categorias;
DROP POLICY IF EXISTS "Authenticated users can manage lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Authenticated users can manage reservas" ON public.reservas;
DROP POLICY IF EXISTS "Authenticated users can manage fechamentos" ON public.fechamentos;

-- Create user-specific policies
CREATE POLICY "Users can manage their own socios" 
ON public.socios FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own categorias" 
ON public.categorias FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own lancamentos" 
ON public.lancamentos FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reservas" 
ON public.reservas FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own fechamentos" 
ON public.fechamentos FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Ensure profiles are secure
DROP POLICY IF EXISTS "Allow public read of profiles" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Create a table for bank accounts (Contas) since it's missing for a finance app
CREATE TABLE IF NOT EXISTS public.contas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT DEFAULT 'corrente' CHECK (tipo IN ('corrente', 'poupanca', 'investimento', 'caixa')),
  banco TEXT,
  saldo_inicial NUMERIC(15, 2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for contas
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;

-- Policy for contas
CREATE POLICY "Users can manage their own contas" 
ON public.contas FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Trigger for contas
CREATE TRIGGER update_contas_updated_at BEFORE UPDATE ON public.contas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add conta_id to lancamentos
ALTER TABLE public.lancamentos ADD COLUMN conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL;
