import { getAuthenticateResponse } from "@/lib/authenticate";
import { generateToken } from "@/lib/jwt";
import { hashPassword } from "@/lib/passwordHash";
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

		const isValidPassword = new RegExp(/^[\sa-zA-Z\d!@#$%^&*()-_=+\[\]\{\};:'",<\.>/\?`\~\|]{8,20}$/).test(
			password
		);

		if (!isValidPassword) {
			return new Response(null, {
				status: 400,
				statusText: "Invalid password",
			});
		}

		const existingUser = await prisma.user.findFirst({ where: { username: { equals: username } } });

		if (existingUser) {
			return new Response(null, { status: 409, statusText: "User already exists" });
		}

		const hashedPassword = await hashPassword(password);
		await prisma.user.create({ data: { username: username, password: hashedPassword } });

		const response = await getAuthenticateResponse(username);

		return response;
	} catch (err) {
		return new Response(JSON.stringify({ message: "Error during signup" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
