import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isModelSlug } from "@/data/model-details/slugs";
import { supabaseEnv } from "@/lib/supabase";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) return refreshSupabaseSession(request);

  /**
   * With Cache Components, a page that calls notFound() for an unlisted param has
   * already started a 200 stream. Rejecting unknown model slugs here returns a
   * proper 404 status before rendering begins.
   */
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (isModelSlug(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

/**
 * Server Components can't write cookies, so the Supabase auth token is refreshed here,
 * before /admin renders. getUser() triggers the refresh when the access token is stale.
 */
async function refreshSupabaseSession(request: NextRequest) {
  const { url, key } = supabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Keep CDNs from caching a response that carries someone's session cookie
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/models/:slug", "/admin/:path*"],
};
