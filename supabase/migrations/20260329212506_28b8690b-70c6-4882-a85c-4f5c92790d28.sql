-- Adiciona colunas necessárias para o DRE e Gestão de Sócios
ALTER TABLE public.categorias 
ADD COLUMN IF NOT EXISTS icone TEXT,
ADD COLUMN IF NOT EXISTS classificacao_dre TEXT DEFAULT 'Despesa Variável' 
CHECK (classificacao_dre IN ('Receita Operacional', 'Dedução', 'Custo', 'Despesa Fixa', 'Despesa Variável', 'Imposto', 'Outras Receitas', 'Outras Despesas'));

-- Adiciona tipo de movimentação em lançamentos para clareza
ALTER TABLE public.lancamentos 
ADD COLUMN IF NOT EXISTS tipo_movimentacao TEXT DEFAULT 'Despesa'
CHECK (tipo_movimentacao IN ('Receita', 'Despesa', 'Transferência'));

-- Tabela de Configurações do Sistema (ex: nome da empresa, logo)
CREATE TABLE IF NOT EXISTS public.configuracoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    empresa_nome TEXT,
    empresa_logo TEXT,
    moeda TEXT DEFAULT 'BRL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar RLS para configuracoes
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar suas próprias configurações" 
ON public.configuracoes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at em configuracoes
CREATE TRIGGER update_configuracoes_updated_at
BEFORE UPDATE ON public.configuracoes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Garantir que a tabela de sócios tenha os campos necessários
ALTER TABLE public.socios
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
