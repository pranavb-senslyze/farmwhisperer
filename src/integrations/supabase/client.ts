// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ezlybjtaybdagcjfrtbz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bHlianRheWJkYWdjamZydGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTQxODcsImV4cCI6MjA1MTMzMDE4N30.NMUJLHlVln3z3kaVd2Ik2oV_MNihM503QBxWMxSRmj4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);