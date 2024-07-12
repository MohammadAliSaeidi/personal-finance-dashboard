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

		const queryResult: any[] =
			await prisma.$queryRaw`SELECT DISTINCT CATEGORY FROM PUBLIC."Expense" E INNER JOIN public."User" U ON U.id = E."userId" WHERE U.username = ${username} AND E.category NOTNULL`;

		const categories = queryResult.map((obj) => obj.category);

		return NextResponse.json(categories);
	} catch {
		return new NextResponse(null, { status: 500, statusText: "Internal Server Error" });
	}
}
