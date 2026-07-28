import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://cbbqrnrqlghvtzsfpdzx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYnFybnJxbGdodnR6c2ZwZHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjY4ODUsImV4cCI6MjA5ODAwMjg4NX0.NKSqMIMhCrq6b-zCSOfMMVKwKHgYRVSrNCb8saL8MU8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
