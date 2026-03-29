-- Adiciona coluna de cor para as reservas, para manter consistência com categorias e contas
ALTER TABLE public.reservas 
ADD COLUMN IF NOT EXISTS cor TEXT DEFAULT '#8B5CF6';

-- Garante que o user_id seja NOT NULL nas tabelas onde é obrigatório para a segurança dos dados
-- e adiciona as foreign keys faltantes caso necessário.

-- Categorias
ALTER TABLE public.categorias 
ALTER COLUMN user_id SET NOT NULL;

-- Contas
ALTER TABLE public.contas 
ALTER COLUMN user_id SET NOT NULL;

-- Lançamentos
ALTER TABLE public.lancamentos 
ALTER COLUMN user_id SET NOT NULL;

-- Reservas
ALTER TABLE public.reservas 
ALTER COLUMN user_id SET NOT NULL;

-- Sócios
ALTER TABLE public.socios 
ALTER COLUMN user_id SET NOT NULL;

-- Fechamentos
ALTER TABLE public.fechamentos 
ALTER COLUMN user_id SET NOT NULL;

-- Orçamentos
ALTER TABLE public.orcamentos 
ALTER COLUMN user_id SET NOT NULL;

-- Modelos Recorrentes
ALTER TABLE public.modelos_recorrentes 
ALTER COLUMN user_id SET NOT NULL;

-- Transferências
ALTER TABLE public.transferencias 
ALTER COLUMN user_id SET NOT NULL;
