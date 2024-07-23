import fetchExpenseCategories from "@/features/RegisterExpense/services/fetchExpenseCategories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "@/features/RegisterExpense/components/ExpenseForm";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export default async function Home() {
	const getCategories = async (): Promise<string[]> => {
		"use server";
		try {
			const cookieStore = cookies();
			const token = cookieStore.get("token");

			if (!token) {
				redirect("/login");
			}

			const {
				payload: { username },
			} = await verifyToken(token.value);

			const queryResult: any[] = await prisma.$queryRaw`
				SELECT DISTINCT c.id, c.name
				FROM PUBLIC."Category" c
				JOIN PUBLIC."ExpenseCategory" ec ON c.id = ec."categoryId"
				JOIN PUBLIC."Expense" e ON ec."expenseId" = e.id
				JOIN PUBLIC."User" u ON e."userId" = u.id
				WHERE u.username = ${username}
				ORDER BY c.name ASC
			`;

			const categories = queryResult.map((obj) => obj.name);
			return categories satisfies string[];
		} catch {
			return [];
		}
	};

	const categories = await getCategories();
	console.log(categories);

	return (
		<main className="min-h-screen h-fit flex items-center justify-center overflow-y-scroll py-6">
			<Card className={"max-w-sm flex-1"}>
				<CardHeader>
					<CardTitle>Create expense</CardTitle>
					<CardDescription>create expense and what you have spend</CardDescription>
				</CardHeader>
				<CardContent>
					<ExpenseForm expenseCategories={categories} />
				</CardContent>
			</Card>
		</main>
	);
}
