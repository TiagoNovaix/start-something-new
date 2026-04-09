
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
