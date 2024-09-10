import connectToDatabase from "@/lib/db";
import Tweet from "@/models/tweet"; // Import from models directory
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request) {
	await connectToDatabase();

	const { ObjectId } = await request.json(); // Use await to parse request body
	const authHeader = request.headers.get("Authorization"); // Use .get() for headers

	if (!ObjectId || !isValidObjectId(ObjectId)) {
		return NextResponse.json(
			{ error: "ObjectId is required and needs to be a valid Id" },
			{ status: 400 }
		);
	}

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return NextResponse.json(
			{ error: "Authorization header is missing or invalid" },
			{ status: 401 }
		);
	}

	const token = authHeader.split(" ")[1];

	try {
		const username = await verifyToken(token);

		let likeTweet = await Tweet.findById(ObjectId);
		if (!likeTweet) {
			return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
		}

		if (username) {
			if (likeTweet.likes.includes(username)) {
				likeTweet.likes.push(username);
				await likeTweet.save(); // Await save operation
				return NextResponse.json(
					{ message: "Tweet liked successfully", tweet: likeTweet },
					{ status: 200 }
				);
			} else if (!likeTweet.likes.includes(username)) {
				likeTweet.likes = likeTweet.likes.filter((user) => user !== username);
				await likeTweet.save(); // Await save operation
				return NextResponse.json(
					{ message: "Tweet unliked successfully", tweet: likeTweet },
					{ status: 200 }
				);
			} else {
				throw new Error("Error liking the Tweet");
			}
		} else {
			throw new Error("Error liking the Tweet");
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Invalid token or error liking tweet" },
			{ status: 401 }
		);
	}
}
