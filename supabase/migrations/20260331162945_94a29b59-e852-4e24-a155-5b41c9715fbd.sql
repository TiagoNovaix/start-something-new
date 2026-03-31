-- Drop the old constraint
ALTER TABLE public.categorias DROP CONSTRAINT IF EXISTS categorias_classificacao_dre_check;

-- Add the new updated constraint with all options from the UI
ALTER TABLE public.categorias ADD CONSTRAINT categorias_classificacao_dre_check 
CHECK (classificacao_dre IN (
    'Receita Bruta',
    'Deduções da Receita',
    'Receita Líquida',
    'Custo dos Serviços/Produtos',
    'Lucro Bruto',
    'Despesa Operacional',
    'Despesa Administrativa',
    'Despesa Comercial',
    'Despesa Financeira',
    'Receita Financeira',
    'Outras Receitas',
    'Outras Despesas',
    'Resultado Antes do IR',
    'Impostos sobre Lucro',
    'Lucro Líquido',
    'Despesa Variável',
    'Despesa Fixa'
));