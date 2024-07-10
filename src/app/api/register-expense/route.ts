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

		const { amount, description, date, category } = await request.json();

		let validatedInput;
		try {
			validatedInput = RegisterExpenseFormSchema.parse({ amount, description, date, category });
		} catch {
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

		const createExpense = await prisma.expense.create({
			data: {
				amount: validatedInput.amount,
				category: validatedInput.category,
				date: validatedInput.date,
				description: validatedInput.description,
				userId: userInDB.id,
			},
		});

		return new Response(null, { status: 201, statusText: "Expense added successfully" });
	} catch (err) {
		return new Response(null, { status: 500, statusText: "registring the expense was failed" });
	}
}
