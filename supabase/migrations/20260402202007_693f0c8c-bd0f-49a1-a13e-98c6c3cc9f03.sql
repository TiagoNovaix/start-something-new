
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_company_id uuid;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );

  -- Create default company
  INSERT INTO public.companies (id, name)
  VALUES (gen_random_uuid(), 'Minha Empresa')
  RETURNING id INTO new_company_id;

  -- Link user to company as admin
  INSERT INTO public.users_companies (user_id, company_id, role)
  VALUES (new.id, new_company_id, 'admin');

  RETURN new;
END;
$function$;
