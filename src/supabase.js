// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jqfeytbifkgrjjlrdzni.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZmV5dGJpZmtncmpqbHJkem5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTQ1MjcsImV4cCI6MjA2NDE3MDUyN30.Er5IfFf5j-E8r0r07tt35Rn89aMNnqmuZoJYCXe_Mv0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
