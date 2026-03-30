-- Create a table for dashboard overview preferences or similar?
-- Actually, let's just add a missing column to the profiles table that's often useful.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
