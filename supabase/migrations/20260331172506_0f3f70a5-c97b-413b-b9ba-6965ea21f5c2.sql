-- Add missing columns to grupos_parcelas for consistency
ALTER TABLE public.grupos_parcelas 
ADD COLUMN IF NOT EXISTS subtipo TEXT,
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS socio_id UUID REFERENCES public.socios(id) ON DELETE SET NULL;

-- Add missing columns to regras_recorrencia for consistency
ALTER TABLE public.regras_recorrencia 
ADD COLUMN IF NOT EXISTS socio_id UUID REFERENCES public.socios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS conta_destino_id UUID REFERENCES public.contas(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_grupos_parcelas_categoria_id ON public.grupos_parcelas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_grupos_parcelas_conta_id ON public.grupos_parcelas(conta_id);
CREATE INDEX IF NOT EXISTS idx_grupos_parcelas_socio_id ON public.grupos_parcelas(socio_id);
CREATE INDEX IF NOT EXISTS idx_regras_recorrencia_socio_id ON public.regras_recorrencia(socio_id);
CREATE INDEX IF NOT EXISTS idx_regras_recorrencia_conta_destino_id ON public.regras_recorrencia(conta_destino_id);