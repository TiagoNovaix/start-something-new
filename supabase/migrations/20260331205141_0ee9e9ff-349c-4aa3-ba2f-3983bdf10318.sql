-- Remove the role column from profiles to prevent privilege escalation
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Drop the existing overly-permissive UPDATE policies
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a restricted UPDATE policy that only allows updating safe columns
-- We use a SECURITY DEFINER function to validate allowed columns
CREATE OR REPLACE FUNCTION public.profiles_update_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow updating safe fields; revert any changes to email
    NEW.id := OLD.id;
    NEW.email := OLD.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_update_check ON public.profiles;
CREATE TRIGGER trigger_profiles_update_check
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.profiles_update_check();

-- Re-create a simple UPDATE policy
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);