import { getEnvVariable } from "@/lib/GetEnvVariable";
import ILoginCredentials from "@/types/LoginCredentials.type";
import axios, { AxiosResponse } from "axios";

export default async function credentialsSignup(
	credentials: ILoginCredentials
): Promise<AxiosResponse<any, any>> {
	const apiUrl = getEnvVariable(
		process.env.NEXT_PUBLIC_CREDENTIALS_SIGNUP_API_URL
	);
	try {
		return await axios.post(apiUrl, credentials);
	} catch (err) {
		throw err;
	}
}
