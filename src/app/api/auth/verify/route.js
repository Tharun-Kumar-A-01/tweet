import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "@/models/user";

const secretKey = process.env.JWT_SECRET;

 const verifyToken = async (token) => {
	try {
		if (!token) {
			throw new Error("Token not found");
		}

		const { payload } = await jwtVerify(token, secretKey);
		return payload.username;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export async function GET (request) {
	await connectToDatabase();

	const authHeader = request.headers.get("authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return NextResponse.json(
			{ error: "Authorization header is missing or invalid" },
			{ status: 401 }
		);
	}

	const token = authHeader.split(" ")[1];
	console.log("Token recieved : ", token);

	try {
		const username = await verifyToken(token);
		const user = await User.findOne({ username });
		console.log("Found user:", user);
		if (user && username) {
			return NextResponse.json({username},{status:200})
		}

	} catch(error) {
		return NextResponse.json(
			{ error: "Invalid credentials" },
			{ status: 403 }
		);
	}
}