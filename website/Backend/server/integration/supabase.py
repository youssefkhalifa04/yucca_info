from supabase import create_client, Client

url = "https://nzxvrvmkepbbtglmkbwd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eHZydm1rZXBiYnRnbG1rYndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTExNzksImV4cCI6MjA2ODQyNzE3OX0.qLJMDiYQniOtJfsKS4md0JyvAfWIYAarXqUBuM00BFg"

supabase: Client = create_client(url, key)