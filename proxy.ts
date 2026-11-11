import { NextResponse, type NextRequest } from "next/server";
import { isModelSlug } from "@/data/model-details/slugs";

/**
 * With Cache Components, a page that calls notFound() for an unlisted param has
 * already started a 200 stream. Rejecting unknown model slugs here returns a
 * proper 404 status before rendering begins.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (isModelSlug(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export const config = {
  matcher: "/models/:slug",
};
