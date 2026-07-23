import { NextResponse, type NextRequest } from "next/server"
// import { createServerClient, type CookieOptions } from "@supabase/ssr"

// The admin CMS isn't wired up yet, so anyone who reaches /admin (or any
// sub-path) is sent back to the home page. When the panel is built, delete
// this and re-enable the Supabase auth guard commented out below.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url))
}

// Future admin auth guard: lets signed-in users into /admin and redirects
// everyone else to /login. Re-enable (and remove the redirect above) once the
// admin panel and /login route exist.
// export async function proxy(request: NextRequest) {
//   const isAdminSection = request.nextUrl.pathname.startsWith("/admin")
//
//   if (!isAdminSection) {
//     return NextResponse.next()
//   }
//
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })
//
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({ name, value, ...options })
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           })
//           response.cookies.set({ name, value, ...options })
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({ name, value: "", ...options })
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           })
//           response.cookies.set({ name, value: "", ...options })
//         },
//       },
//     },
//   )
//
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//
//   if (!user && request.nextUrl.pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/login", request.url))
//   }
//
//   return response
// }

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
