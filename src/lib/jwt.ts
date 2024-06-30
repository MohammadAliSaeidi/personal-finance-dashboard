import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(token: string) {
	try {
		if (SECRET_KEY) {
			return jwt.verify(token, SECRET_KEY);
		} else {
			throw new Error("Could not verify token. because the secret key is not available");
		}
	} catch (error) {
		throw new Error("Invalid token");
	}
}

export function generateToken(username: string) {
	if (SECRET_KEY) {
		jwt.sign({ username: username }, SECRET_KEY, { expiresIn: "1h" });
	} else {
		throw new Error("Could not generate token. because the secret key is not available");
	}
}
