import ILoginCredentials from "@/types/LoginCredentials.type";
import axios, { AxiosResponse } from "axios";

export default async function credentialsLogin(
	credentials: ILoginCredentials
): Promise<AxiosResponse<any, any>> {
	const apiUrl = process.env.CREDENTIALS_LOGIN_API_URL;
	try {
		// if (!apiUrl) {
		// 	if (process.env.NODE_ENV !== "production") {
		// 		console.error(
		// 			"Credentials login not available in environment variable file"
		// 		);
		// 	}
		// 	throw new Error("can not access the Login API");
		// }
		return await axios.post("/api/login", credentials);
	} catch (err) {
		throw err;
	}
}
