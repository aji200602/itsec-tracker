import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://icqitobgaotyrspnevkl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcWl0b2JnYW90eXJzcG5ldmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMDcwMDcsImV4cCI6MjEwMjU4MzAwN30.znlGATrbn3R_SWr-kYyH0qMAEnniOv4iQs7RpgHMqzo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
