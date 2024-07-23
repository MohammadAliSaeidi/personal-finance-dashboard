import { checkSqlInjection, sqlInjectionRegex } from "@/lib/utils";
import { z } from "zod";

// const emptyInput = (val?: string) => /^\s*$/.test(val ?? "");

export const RegisterExpenseFormSchema = z.object({
	amount: z.coerce
		.number({ required_error: "please enter the expense amount" })
		.int()
		.positive({ message: "please enter the expense amount" }),
	category: z.string().refine(checkSqlInjection, { message: "SQL queries are not allowed :)" }).optional(),
	categories: z
		.array(
			z.object({
				category: z.string().refine(checkSqlInjection, {
					message: "SQL queries are not allowed :)",
				}),
			})
		)
		.optional(),
	description: z.string().optional().refine(checkSqlInjection, {
		message: "SQL queries are not allowed :)",
	}),
	date: z.date().optional(),
});

export type RegisterExpenseFormSchemaType = z.infer<typeof RegisterExpenseFormSchema>;
