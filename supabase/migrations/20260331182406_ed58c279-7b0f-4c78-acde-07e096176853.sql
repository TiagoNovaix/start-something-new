-- Function to automatically add the creator of a company to the users_companies table
CREATE OR REPLACE FUNCTION public.handle_company_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users_companies (company_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'admin');
    RETURN NEW;
END;
$$;

-- Trigger to handle company creation
DROP TRIGGER IF EXISTS trigger_handle_company_creator ON public.companies;
CREATE TRIGGER trigger_handle_company_creator
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.handle_company_creator();

-- Function to automatically set company_id on insert if not provided
CREATE OR REPLACE FUNCTION public.set_company_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_company_id uuid;
BEGIN
    -- If company_id is already provided, just return
    IF NEW.company_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- Try to find the company the user belongs to
    SELECT company_id INTO current_company_id
    FROM public.users_companies
    WHERE user_id = auth.uid()
    LIMIT 1;

    -- If a company was found, set it
    IF current_company_id IS NOT NULL THEN
        NEW.company_id := current_company_id;
    END IF;

    RETURN NEW;
END;
$$;

-- Helper to apply the set_company_id trigger to a table
-- (We'll do this manually for the most important tables to ensure reliability)

-- Apply to lancamentos
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.lancamentos;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.lancamentos
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to contas
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.contas;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.contas
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to categorias
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.categorias;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.categorias
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to centros_custo
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.centros_custo;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.centros_custo
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to socios
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.socios;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.socios
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to configuracoes
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.configuracoes;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.configuracoes
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to bank_accounts
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.bank_accounts;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.bank_accounts
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to metas
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.metas;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.metas
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to reservas
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.reservas;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to movimentacoes_reservas
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.movimentacoes_reservas;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.movimentacoes_reservas
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to orcamentos
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.orcamentos;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.orcamentos
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to regras_recorrencia
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.regras_recorrencia;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.regras_recorrencia
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to grupos_parcelas
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.grupos_parcelas;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.grupos_parcelas
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();

-- Apply to monthly_closings
DROP TRIGGER IF EXISTS trigger_set_company_id ON public.monthly_closings;
CREATE TRIGGER trigger_set_company_id
BEFORE INSERT ON public.monthly_closings
FOR EACH ROW
EXECUTE FUNCTION public.set_company_id();
