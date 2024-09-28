import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "crypto";
import { SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET;

async function verifyPassword(password, user_password) {
	const [salt, key] = user_password.split(":");
	const hashedBuffer = scryptSync(password, salt, 64);
	const keyBuffer = Buffer.from(key, "hex");
	return timingSafeEqual(hashedBuffer, keyBuffer);
}

export async function POST(request) {
	await connectToDatabase();

	const { username, password } = await request.json();
	if (!username || !password) {
		return NextResponse.json(
			{ error: "Username and password are required" },
			{ status: 400 }
		);
	}

	try {
		console.log("Received login request:", { username, password });

		const user = await User.findOne({ username });
		console.log("Found user:", user);
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isMatch = await verifyPassword(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const token = await new SignJWT({ username }).setProtectedHeader({ alg: "HS256" }).sign(secretKey);

		console.log("Generated token:", token);

		return NextResponse.json({ token }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error Logging in" }, { status: 500 });
	}
}
