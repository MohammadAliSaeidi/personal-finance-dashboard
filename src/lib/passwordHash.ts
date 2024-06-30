import bcrypt from "bcryptjs";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (error) {
		throw new Error("Error hashing password");
	}
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
	try {
		const match = await bcrypt.compare(password, hash);
		return match;
	} catch (error) {
		throw new Error("Error comparing passwords");
	}
}
