// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lrlqobyexmqdustwaaxi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybHFvYnlleG1xZHVzdHdhYXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzA1ODMsImV4cCI6MjA2MzU0NjU4M30._jBzOD18jUM8-kzIq-PGaWPtuh1mZku1fw5bb0_eDis"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
