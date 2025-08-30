-- Fix for Row-Level Security issue with egg_info table
-- Run these commands in your Supabase SQL Editor

-- Option 1: Disable RLS for the egg_info table (Recommended)
ALTER TABLE public.egg_info DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create a policy that allows all operations
-- CREATE POLICY "Allow all operations on egg_info" ON public.egg_info
-- FOR ALL USING (true) WITH CHECK (true);

-- Option 3: Create a policy that allows authenticated users to read and insert
-- CREATE POLICY "Allow authenticated users on egg_info" ON public.egg_info
-- FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Verify the table structure
SELECT * FROM public.egg_info LIMIT 5;

