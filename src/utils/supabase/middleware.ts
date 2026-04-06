import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vdmvvipbnfxxxtnucqzj.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXZ2aXBibmZ4eHh0bnVjcXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDIxNzIsImV4cCI6MjA5MTAxODE3Mn0.raMKOOY4x0jvpdsQti0JYtD_0fs9vuc7sAPiGzVdSBs";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: any[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Use getUser() NOT getSession() — getSession() reads from
  // storage and is not guaranteed to be authenticated. getUser() sends a
  // request to the Supabase Auth server every time to revalidate the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/auth");
  const isRootPage = pathname === "/";
  const isApiRoute = pathname.startsWith("/api");

  // Don't redirect API routes
  if (isApiRoute) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login (except public pages)
  if (!user && !isAuthPage && !isRootPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // CRITICAL: We must still return supabaseResponse cookies by setting them
    // on the redirect response so the session refresh is not lost.
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // If user is authenticated and tries to access login, redirect to dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
