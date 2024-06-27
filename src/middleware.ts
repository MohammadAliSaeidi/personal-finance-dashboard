import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;

	// Define paths that should be protected
	const protectedPaths = ["/test"];

	// Check if the requested path is protected
	const isProtectedPath = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	);

	if (isProtectedPath) {
		if (!token) {
			// Redirect to login if there's no token
			return NextResponse.redirect(new URL("/login", request.url));
		}

		try {
			// Verify the token
			verifyToken(token);
			// If verification is successful, allow the request to continue
			return NextResponse.next();
		} catch (error) {
			// If verification fails, redirect to login
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// For non-protected routes, allow the request to continue
	return NextResponse.next();
}

// Optionally, you can specify which routes this middleware applies to
export const config = {
	matcher: ["/((?!login).*)"],
};
