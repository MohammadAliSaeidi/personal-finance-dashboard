import { getEnvVariable } from "@/lib/GetEnvVariable";
import axios, { AxiosResponse } from "axios";
import { RegisterExpenseFormSchemaType } from "../formSchema";

export default async function registerExpense(
	expenseData: RegisterExpenseFormSchemaType
): Promise<AxiosResponse<any, any>> {
	const apiUrl = getEnvVariable(process.env.NEXT_PUBLIC_REGISTER_EXPENSE_API_URL);
	try {
		return await axios.post(apiUrl, expenseData);
	} catch (err) {
		throw err;
	}
}
