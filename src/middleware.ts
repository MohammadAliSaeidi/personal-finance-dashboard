import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	const protectedPaths = ["/"];
	const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.endsWith(path));

	if (isProtectedPath) {
		console.log("token", token);

		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		try {
			const tokenData = await verifyToken(token);

			// Check token expiration
			const currentTimestamp = Math.floor(Date.now() / 1000);
			if (tokenData.payload.exp && tokenData.payload.exp < currentTimestamp) {
				console.log("Token has expired");
				return NextResponse.redirect(new URL("/login", request.url));
			}

			// Token is valid and not expired
			return NextResponse.next();
		} catch (error) {
			console.error("Token verification failed:", error);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
