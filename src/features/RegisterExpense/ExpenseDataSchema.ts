import { checkSqlInjection } from "@/lib/utils";
import { z } from "zod";

export const ExpenseDataSchema = z.object({
	amount: z
		.number({ required_error: "please enter the expense amount" })
		.int()
		.positive({ message: "please enter the expense amount" }),
	categories: z
		.array(
			z.string().refine(checkSqlInjection, {
				message: "SQL queries are not allowed :)",
			})
		)
		.optional(),
	description: z.string().optional().refine(checkSqlInjection, {
		message: "SQL queries are not allowed :)",
	}),
	date: z.coerce.date().optional(),
});

export type ExpenseDataType = z.infer<typeof ExpenseDataSchema>;
