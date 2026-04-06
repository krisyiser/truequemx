import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vdmvvipbnfxxxtnucqzj.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXZ2aXBibmZ4eHh0bnVjcXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDIxNzIsImV4cCI6MjA5MTAxODE3Mn0.raMKOOY4x0jvpdsQti0JYtD_0fs9vuc7sAPiGzVdSBs";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
