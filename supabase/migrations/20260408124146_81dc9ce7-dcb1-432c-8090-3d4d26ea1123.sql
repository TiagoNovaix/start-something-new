
CREATE OR REPLACE FUNCTION public.seed_default_categorias()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user who created this company (from users_companies or the trigger context)
  SELECT user_id INTO v_user_id FROM public.users_companies WHERE company_id = NEW.id LIMIT 1;
  
  -- If no user found yet (company just created), try auth.uid()
  IF v_user_id IS NULL THEN
    v_user_id := auth.uid();
  END IF;
  
  -- If still null, skip seeding
  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.categorias (nome, tipo, classificacao_dre, subgrupo, company_id, user_id) VALUES
    -- Receitas
    ('Vendas de Produtos', 'entrada', 'Receita Bruta', 'Vendas', NEW.id, v_user_id),
    ('Prestação de Serviços', 'entrada', 'Receita Bruta', 'Serviços', NEW.id, v_user_id),
    ('Receita de Assinaturas', 'entrada', 'Receita Bruta', 'Recorrente', NEW.id, v_user_id),
    ('Rendimentos Financeiros', 'entrada', 'Receita Financeira', NULL, NEW.id, v_user_id),
    ('Outras Receitas', 'entrada', 'Outras Receitas', NULL, NEW.id, v_user_id),
    -- Deduções
    ('Impostos sobre Vendas', 'saida', 'Deduções da Receita', 'Impostos', NEW.id, v_user_id),
    ('Devoluções', 'saida', 'Deduções da Receita', 'Devoluções', NEW.id, v_user_id),
    -- Custos
    ('Custo de Mercadoria', 'saida', 'Custo dos Serviços/Produtos', 'CMV', NEW.id, v_user_id),
    ('Custo de Serviço Prestado', 'saida', 'Custo dos Serviços/Produtos', 'CSP', NEW.id, v_user_id),
    -- Despesas Operacionais
    ('Aluguel', 'saida', 'Despesa Fixa', 'Infraestrutura', NEW.id, v_user_id),
    ('Energia e Água', 'saida', 'Despesa Fixa', 'Infraestrutura', NEW.id, v_user_id),
    ('Internet e Telefone', 'saida', 'Despesa Fixa', 'Infraestrutura', NEW.id, v_user_id),
    ('Salários e Encargos', 'saida', 'Despesa Fixa', 'Pessoal', NEW.id, v_user_id),
    ('Pró-labore', 'saida', 'Despesa Fixa', 'Pessoal', NEW.id, v_user_id),
    ('Benefícios', 'saida', 'Despesa Fixa', 'Pessoal', NEW.id, v_user_id),
    ('Marketing e Publicidade', 'saida', 'Despesa Variável', 'Marketing', NEW.id, v_user_id),
    ('Materiais de Escritório', 'saida', 'Despesa Variável', 'Administrativo', NEW.id, v_user_id),
    ('Software e Assinaturas', 'saida', 'Despesa Variável', 'Tecnologia', NEW.id, v_user_id),
    ('Contabilidade', 'saida', 'Despesa Administrativa', 'Terceiros', NEW.id, v_user_id),
    ('Consultoria', 'saida', 'Despesa Administrativa', 'Terceiros', NEW.id, v_user_id),
    -- Financeiro
    ('Juros Pagos', 'saida', 'Despesa Financeira', NULL, NEW.id, v_user_id),
    ('Tarifas Bancárias', 'saida', 'Despesa Financeira', NULL, NEW.id, v_user_id),
    -- Impostos sobre lucro
    ('IRPJ', 'saida', 'Impostos sobre Lucro', NULL, NEW.id, v_user_id),
    ('CSLL', 'saida', 'Impostos sobre Lucro', NULL, NEW.id, v_user_id);

  RETURN NEW;
END;
$$;

-- Attach trigger to companies table (AFTER INSERT so users_companies row exists)
DROP TRIGGER IF EXISTS trg_seed_default_categorias ON public.companies;
CREATE TRIGGER trg_seed_default_categorias
  AFTER INSERT ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_default_categorias();
