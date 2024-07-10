import { sqlInjectionRegex } from "@/lib/utils";
import { z } from "zod";

const checkSqlInjection = (val?: string) => !sqlInjectionRegex.test(val ?? "");

export const RegisterExpenseFormSchema = z.object({
	amount: z.coerce.number({ required_error: "please enter the expense amount" }).int().nonnegative(),
	category: z.string().optional().refine(checkSqlInjection, {
		message: "SQL queries are not allowed :)",
	}),
	description: z.string().optional().refine(checkSqlInjection, {
		message: "SQL queries are not allowed :)",
	}),
	date: z.date().optional(),
});

export type RegisterExpenseFormSchemaType = z.infer<typeof RegisterExpenseFormSchema>;
