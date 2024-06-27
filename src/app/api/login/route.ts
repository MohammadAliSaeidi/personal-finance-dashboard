export async function POST(request: Request) {
	const { username, password, test } = await request.json();

	if (!username || !password || !test) {
		return new Response(null, {
			status: 400,
			statusText: "Invalid request fields",
		});
	}

	return Response.json({ message: "success" });
}
