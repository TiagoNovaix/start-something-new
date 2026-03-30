-- Create a function to set user_id from auth.uid()
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tables that have a user_id column and need automatic assignment
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'user_id'
        AND table_name NOT IN ('profiles') -- profiles uses id as user_id
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_set_user_id ON public.%I', t);
        EXECUTE format('CREATE TRIGGER trigger_set_user_id BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_user_id()', t);
    END LOOP;
END;
$$;

-- Ensure all tables have updated_at triggers
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'updated_at'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_updated_at ON public.%I', t);
        EXECUTE format('CREATE TRIGGER trigger_update_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
    END LOOP;
END;
$$;
