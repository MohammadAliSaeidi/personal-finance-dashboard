import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Sql } from "@prisma/client/runtime/library";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const cookieStore = cookies();
		const token = cookieStore.get("token");

		if (!token) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const {
			payload: { username },
		} = await verifyToken(token.value);

		const userInDB = await prisma.user.findFirst({ where: { username: username } });

		const queryResult: any[] = await prisma.$queryRaw`
			SELECT DISTINCT c.id, c.name
			FROM "Category" c
			JOIN "ExpenseCategory" ec ON c.id = ec."categoryId"
			JOIN "Expense" e ON ec."expenseId" = e.id
			WHERE e."userId" = ${userInDB}
			ORDER BY c.name ASC
		`;

		console.log(queryResult);

		const categories = queryResult.map((obj) => obj.category);

		return NextResponse.json(categories);
	} catch {
		return new NextResponse(null, { status: 500, statusText: "Internal Server Error" });
	}
}
