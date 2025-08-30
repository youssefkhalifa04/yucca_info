import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://nzxvrvmkepbbtglmkbwd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eHZydm1rZXBiYnRnbG1rYndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTExNzksImV4cCI6MjA2ODQyNzE3OX0.qLJMDiYQniOtJfsKS4md0JyvAfWIYAarXqUBuM00BFg"
export const supabase = createClient(supabaseUrl, supabaseKey)