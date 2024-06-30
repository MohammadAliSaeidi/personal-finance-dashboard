import { generateToken } from "./jwt";

export function getAuthenticateResponse(username: string) {
	const response = new Response(null, {
		status: 201,
		statusText: "Signup successful",
	});
	const token = generateToken(username);

	response.headers.set(
		"Set-Cookie",
		`token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${
			process.env.NODE_ENV !== "development" ? "; Secure" : ""
		}`
	);
}
