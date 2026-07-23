import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let static assets, api, or next internals pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  let token = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  let responseCookiesToSet: string[] = [];
  let isRefreshed = false;

  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/citizen");
  const isAuthRoute =
    pathname === "/member_login" ||
    pathname === "/admin/login" ||
    pathname === "/join_us";

  // Server-side silent token refresh if access_token is expired/missing but refresh_token exists
  if (!token && refreshToken && (isProtectedRoute || isAuthRoute)) {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (refreshResponse.ok) {
        // Retrieve the Set-Cookie headers from Go backend response
        const setCookieHeaders = refreshResponse.headers.getSetCookie();
        responseCookiesToSet = setCookieHeaders;

        // Parse new access token to verify auth status for routing
        for (const cookieStr of setCookieHeaders) {
          if (cookieStr.trim().startsWith("access_token=")) {
            const match = cookieStr.match(/access_token=([^;]+)/);
            if (match) {
              token = match[1];
              isRefreshed = true;
            }
          }
        }
      } else {
        // Clear invalid cookies to prevent repeating refresh calls on every page load
        responseCookiesToSet = [
          "access_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
          "refresh_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
        ];
        isRefreshed = true;
      }
    } catch (e) {
      console.error("Server-side token refresh failed in middleware:", e);
    }
  }

  const payload = token ? parseJwt(token) : null;
  const userType = payload?.user_type; // 'admin' or 'member'

  // Helper to construct response and apply any refreshed cookies
  const createResponse = (nextResponse: NextResponse) => {
    if (isRefreshed && responseCookiesToSet.length > 0) {
      responseCookiesToSet.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }
    return nextResponse;
  };

  // Admin routes protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token || userType !== "admin") {
      const redirectRes = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      if (!token) {
        redirectRes.cookies.delete("access_token");
        redirectRes.cookies.delete("refresh_token");
      }
      return redirectRes;
    }
  }

  // Citizen/Member routes protection
  if (pathname.startsWith("/citizen")) {
    if (!token || userType === "admin") {
      const redirectRes = NextResponse.redirect(
        new URL("/member_login", request.url),
      );
      if (!token) {
        redirectRes.cookies.delete("access_token");
        redirectRes.cookies.delete("refresh_token");
      }
      return redirectRes;
    }
  }

  // Auth pages redirection — only redirect if the MATCHING user type is already logged in.
  // An admin visiting /member_login should NOT be redirected (they're not a member).
  // A member visiting /admin/login should NOT be redirected (they're not an admin).
  if (token && userType) {
    if (pathname === "/member_login" || pathname === "/join_us") {
      if (userType !== "admin") {
        return createResponse(
          NextResponse.redirect(new URL("/citizen", request.url)),
        );
      }
    }
    if (pathname === "/admin/login") {
      if (userType === "admin") {
        return createResponse(
          NextResponse.redirect(new URL("/admin", request.url)),
        );
      }
    }
  }

  // If we refreshed the token, redirect the browser to the same URL so that
  // the client browser saves the new access_token cookie, and the subsequent
  // request contains the new access_token, which is then visible to Server Components.
  if (isRefreshed && token) {
    return createResponse(NextResponse.redirect(new URL(request.url)));
  }

  return createResponse(NextResponse.next());
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)"],
};
