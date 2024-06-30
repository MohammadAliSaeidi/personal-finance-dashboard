import { getEnvVariable } from "@/lib/GetEnvVariable";
import ILoginCredentials from "@/types/LoginCredentials.type";
import axios, { AxiosResponse } from "axios";

export default async function credentialsLogin(
	credentials: ILoginCredentials
): Promise<AxiosResponse<any, any>> {
	const apiUrl = getEnvVariable(
		process.env.NEXT_PUBLIC_CREDENTIALS_LOGIN_API_URL
	);
	try {
		return await axios.post("/api/login", credentials);
	} catch (err) {
		throw err;
	}
}
