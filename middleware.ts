// import { NextRequest, NextResponse } from "next/server";

// export default function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const token = req.cookies.get("token")?.value;

//   const protectedRoutes = [
//     "/cart",
//     "/farmer",
//   ];

//   const isProtectedRoute = protectedRoutes.some((route) =>
//     path.startsWith(route)
//   );
//   const isSigninRoute = path === "/signin";

//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }
//   if (isSigninRoute && token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|images|icons|_next/image|.*\\.(?:png|svg|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const protectedRoutes = ["/farmer", "/cart",];

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isSigninRoute = path === "/signin";

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (isSigninRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|images|icons|_next/image|.*\\.(?:png|svg|jpg|jpeg|gif|webp)$).*)",
  ],
};


