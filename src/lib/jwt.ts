import Token from "@/types/token.type";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in environment variables");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function generateToken(payload: Token) {
	try {
		const token = await new SignJWT({ ...payload })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1 h")
			.sign(secret);

		return token;
	} catch (error) {
		console.error("Error generating token:", error);
		throw new Error("Failed to generate token");
	}
}

export async function verifyToken(token: string) {
	try {
		const decodedToken = await jwtVerify<Token>(token, secret);
		return decodedToken;
	} catch (error) {
		console.error("Error verifying token:", error);
		throw new Error("Invalid token");
	}
}
