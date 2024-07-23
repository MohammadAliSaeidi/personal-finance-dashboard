import { ExpenseDataSchema, ExpenseDataType } from "@/features/RegisterExpense/ExpenseDataSchema";
import { RegisterExpenseFormSchema } from "@/features/RegisterExpense/formSchema";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const cookieStore = cookies();
		const token = cookieStore.get("token");

		if (!token) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const decodedToken = await verifyToken(token.value);
		const expenseData: ExpenseDataType = await request.json();

		// validate input
		try {
			ExpenseDataSchema.parse(expenseData);
		} catch (error) {
			console.log(error);
			return new Response(null, {
				status: 400,
				statusText: "invalid request fields",
			});
		}

		const userInDB = await prisma.user.findFirst({ where: { username: decodedToken.payload.username } });

		if (userInDB === null) {
			return new Response(null, {
				status: 404,
				statusText: "User not found",
			});
		}

		const t = await prisma.$transaction(async (tx) => {
			const expense = await tx.expense.create({
				data: {
					amount: expenseData.amount,
					date: expenseData.date,
					description: expenseData.description,
					userId: userInDB.id,
				},
			});

			const existingCategories = await tx.category.findMany({
				where: {
					name: {
						in: expenseData.categories,
					},
				},
			});

			const existingCategoryNames = existingCategories.map((cat) => cat.name);
			const newCategoryNames = expenseData.categories?.filter((name) => !existingCategoryNames.includes(name));

			if (newCategoryNames && newCategoryNames.length > 0) {
				await tx.category.createMany({
					data: newCategoryNames.map((name) => ({ name })),
					skipDuplicates: true,
				});
			}

			const allCategories = await tx.category.findMany({
				where: {
					name: {
						in: expenseData.categories,
					},
				},
			});

			await tx.expenseCategory.createMany({
				data: allCategories.map((category) => ({
					expenseId: expense.id,
					categoryId: category.id,
				})),
			});

			return expense;
		});

		return new Response(null, { status: 201, statusText: "Expense added successfully" });
	} catch (err) {
		return new Response(null, { status: 500, statusText: "registring the expense was failed" });
	}
}
