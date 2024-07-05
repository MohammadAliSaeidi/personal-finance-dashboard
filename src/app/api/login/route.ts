import { getAuthenticateResponse } from "@/lib/authenticate";
import { comparePassword, hashPassword } from "@/lib/passwordHash";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	const { username, password } = await request.json();

	try {
		if (!username || !password) {
			return new Response(null, {
				status: 400,
				statusText: "Invalid request fields",
			});
		}

		const hashedPassword = await hashPassword(password);
		const isPasswordCorrect = await comparePassword(password, hashedPassword);

		if (!isPasswordCorrect) {
			return new Response(null, { status: 401, statusText: "User not found or not authenticated" });
		}

		const userInDB = await prisma.user.findFirst({ where: { username: username } });

		if (userInDB === null) {
			return new Response(null, { status: 401, statusText: "User not found or not authenticated" });
		}

		const response = getAuthenticateResponse(username);

		return response;
	} catch (err) {
		return new Response(null, { status: 500, statusText: "login was failed" });
	}
}
