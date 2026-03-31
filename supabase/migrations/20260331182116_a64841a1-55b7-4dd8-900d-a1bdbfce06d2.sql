-- Fix search path for all functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.is_month_closed(integer, integer) SET search_path = public;