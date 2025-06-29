
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cestnycgnhgoraefojke.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc3RueWNnbmhnb3JhZWZvamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDcyMDEsImV4cCI6MjA2NDg4MzIwMX0.qfuYfkYZbcSdOzMRGN-foDLznCYJWCHpXune1l8P34U"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
