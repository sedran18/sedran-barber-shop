import { auth } from "@/auth"
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth; 
    const role = req.auth?.user?.role;

    if (nextUrl.pathname.startsWith("/api/webhooks")) {
        return NextResponse.next();
    }

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPrivateRoute = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute = nextUrl.pathname === "/login";
    
    const onlyAdminRoutes = ["/admin/dashboard", "/admin/gestao"];
    const isRestrictedAdminRoute = onlyAdminRoutes.some(route => nextUrl.pathname.startsWith(route));

    if (isApiAuthRoute) return NextResponse.next();

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/agenda", nextUrl));
        }
        return NextResponse.next();
    }

    if (isPrivateRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (isRestrictedAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL("/admin/agenda", nextUrl));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}