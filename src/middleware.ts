import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { localePrefix, locales } from "./navigation";

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

function matchesPath(
  pathname: string,
  targetPath: string,
  opts: { compareType?: "exact" | "startsWith" } = {
    compareType: "startsWith",
  },
): boolean {
  const localePattern = /^\/(en|ar)(\/|$)/;
  const normalizedPath = pathname.replace(localePattern, "/");
  return opts.compareType === "startsWith"
    ? normalizedPath.startsWith(targetPath)
    : normalizedPath === targetPath;
}

const authMiddleware = withAuth(
  function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;

    const localeCookie = request.cookies.get("NEXT_LOCALE");
    const locale = localeCookie?.value ?? "en";
    if (
      (matchesPath(pathname, "/login") || matchesPath(pathname, "/register")) &&
      token
    ) {
      console.log(matchesPath(pathname, "/login"));
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    if (
      matchesPath(pathname, "/dashboard") &&
      token?.role !== "ADMIN" &&
      token?.role !== "MANAGER"
    ) {
      return NextResponse.rewrite(new URL(`/${locale}/denied`, request.url));
    }
    if (
      matchesPath(pathname, "/my-account", { compareType: "exact" }) &&
      token?.email === "admin@yummy.com"
    ) {
      return NextResponse.rewrite(new URL(`/${locale}/denied`, request.url));
    }
    return intlMiddleware(request);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        if (
          matchesPath(pathname, "/my-account") ||
          matchesPath(pathname, "/dashboard")
        ) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected =
    matchesPath(pathname, "/my-account") ||
    matchesPath(pathname, "/dashboard") ||
    matchesPath(pathname, "/login") ||
    matchesPath(pathname, "/register");

  if (isProtected) {
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
