import { scryptSync, randomBytes } from "crypto";
import connectToDatabase from "@/lib/db.js";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET;

export async function POST(request) {
	await connectToDatabase();

	// Parse the request body as JSON
	const { username, password } = await request.json();

	if (!username || !password) {
		return NextResponse.json(
			{ error: "Username and password are required" },
			{ status: 400 }
		);
	}

	try {
		const salt = randomBytes(16).toString("hex");
		const hashedPassword = scryptSync(password, salt, 64).toString("hex");

		const newUser = new User({
			username,
			password: `${salt}:${hashedPassword}`,
		});
		await newUser.save();
		
		const token = await new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).sign(secretKey);

		return NextResponse.json({ token }, { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ error: `Error: ${error.message}` },
			{ status: 500 }
		);
	}
}
