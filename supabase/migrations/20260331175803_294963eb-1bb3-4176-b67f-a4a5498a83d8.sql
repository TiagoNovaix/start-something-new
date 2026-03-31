-- Create companies table
CREATE TABLE public.companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT,
    tax_regime TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users_companies junction table
CREATE TABLE public.users_companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, company_id)
);

-- Create partners table
CREATE TABLE public.partners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    equity_percentage DECIMAL(5,2) NOT NULL,
    pro_labore DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_accounts table
CREATE TABLE public.bank_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    current_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view companies they belong to"
ON public.companies
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = companies.id
        AND users_companies.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update companies they are admin of"
ON public.companies
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = companies.id
        AND users_companies.user_id = auth.uid()
        AND users_companies.role = 'admin'
    )
);

-- RLS Policies for users_companies
CREATE POLICY "Users can view their own company memberships"
ON public.users_companies
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage company memberships"
ON public.users_companies
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies uc
        WHERE uc.company_id = users_companies.company_id
        AND uc.user_id = auth.uid()
        AND uc.role = 'admin'
    )
);

-- Allow insertion during onboarding (this is a bit tricky, usually we'd use a function or allow based on some logic)
-- For onboarding, we allow insert if it's the first company or we trust the user.
CREATE POLICY "Users can join companies"
ON public.users_companies
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS Policies for partners
CREATE POLICY "Users can view partners of their companies"
ON public.partners
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = partners.company_id
        AND users_companies.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage partners"
ON public.partners
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = partners.company_id
        AND users_companies.user_id = auth.uid()
        AND users_companies.role = 'admin'
    )
);

-- RLS Policies for bank_accounts
CREATE POLICY "Users can view bank accounts of their companies"
ON public.bank_accounts
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = bank_accounts.company_id
        AND users_companies.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage bank accounts"
ON public.bank_accounts
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.users_companies
        WHERE users_companies.company_id = bank_accounts.company_id
        AND users_companies.user_id = auth.uid()
        AND users_companies.role = 'admin'
    )
);

-- Companies insertion policy (for onboarding)
CREATE POLICY "Users can create companies"
ON public.companies
FOR INSERT
WITH CHECK (true);

-- Functions for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
