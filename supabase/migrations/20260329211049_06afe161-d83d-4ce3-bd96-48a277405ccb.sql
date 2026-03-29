-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create socios table
CREATE TABLE IF NOT EXISTS public.socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  participacao NUMERIC(5, 2) NOT NULL DEFAULT 0, -- Percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create categorias table
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
  cor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create lancamentos table
CREATE TABLE IF NOT EXISTS public.lancamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  valor NUMERIC(15, 2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  socio_id UUID REFERENCES public.socios(id) ON DELETE SET NULL, -- For withdrawals/investments
  comprovante_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid()
);

-- Create reservas table
CREATE TABLE IF NOT EXISTS public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  saldo_atual NUMERIC(15, 2) NOT NULL DEFAULT 0,
  meta NUMERIC(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create fechamentos table
CREATE TABLE IF NOT EXISTS public.fechamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL,
  data_fechamento TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'fechado' CHECK (status IN ('aberto', 'fechado')),
  UNIQUE(mes, ano)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fechamentos ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Assuming users belong to the same workspace or simple single-user app for now)
-- You can refine these later if multi-tenancy is needed.

CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- For now, let's allow authenticated users full access to the business data
-- This is a common starting point for internal tools.

CREATE POLICY "Authenticated users can manage socios" ON public.socios FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage categorias" ON public.categorias FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage lancamentos" ON public.lancamentos FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage reservas" ON public.reservas FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage fechamentos" ON public.fechamentos FOR ALL TO authenticated USING (true);

-- Functions for timestamp updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_socios_updated_at BEFORE UPDATE ON public.socios FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON public.reservas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
