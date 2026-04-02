
-- Fix handle_company_creator to skip when no auth session (signup trigger context)
CREATE OR REPLACE FUNCTION public.handle_company_creator()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Skip if no authenticated user (e.g. called from handle_new_user trigger)
    IF auth.uid() IS NOT NULL THEN
        INSERT INTO public.users_companies (company_id, user_id, role)
        VALUES (NEW.id, auth.uid(), 'admin');
    END IF;
    RETURN NEW;
END;
$function$;

-- Create company for existing user who has no company
DO $$
DECLARE
  uid uuid;
  cid uuid;
BEGIN
  FOR uid IN 
    SELECT u.id FROM auth.users u
    WHERE NOT EXISTS (SELECT 1 FROM public.users_companies uc WHERE uc.user_id = u.id)
  LOOP
    cid := gen_random_uuid();
    INSERT INTO public.companies (id, name) VALUES (cid, 'Minha Empresa');
    INSERT INTO public.users_companies (user_id, company_id, role) VALUES (uid, cid, 'admin');
  END LOOP;
END $$;
