import { getEnvVariable } from "@/lib/GetEnvVariable";
import axios, { AxiosResponse } from "axios";
import { RegisterExpenseFormSchemaType } from "../formSchema";

export default async function fetchExpenseCategories(): Promise<string[]> {
	const apiUrl = getEnvVariable(process.env.NEXT_PUBLIC_FETCH_EXPENSE_CATEGORIES_API_URL);
	try {
		const response = await axios.get(apiUrl);
		return response.data satisfies string[];
	} catch (err) {
		throw err;
	}
}
