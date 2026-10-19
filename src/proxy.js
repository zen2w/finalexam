import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function proxy(request) {
  const supabase = await getSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // If accessing protected routes while unauthenticated
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/ticket") && !session) {
    // allow public view or redirect depending on ownership check in route
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
