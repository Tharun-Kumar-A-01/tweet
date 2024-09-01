import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Tweet from '@/models/tweet';
import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
	await connectToDatabase();

	const { content } = await request.json();
	const authHeader = request.headers.get('authorization');

	if (!content || typeof content !== 'string') {
		return NextResponse.json({ error: "Content is required and should be a string" },{ status: 400});
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({ error: "Authorization header is missing or invalid" },{ status: 401});
	}

	const token = authHeader.split(' ')[1];
	console.log("Token recieved : ",token);
	
	try {
		const username = await verifyToken(token)
		const newTweet = new Tweet({ content, username });
		await newTweet.save();

		return NextResponse.json({ message: 'Tweet created successfully', tweet: newTweet }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}

export async function GET(request) {
	await connectToDatabase();

	try {
		const tweetList = await Tweet.find().lean(); // Convert to plain JS object, removing Mongoose methods and possible circular references
		return NextResponse.json({ tweets: tweetList }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request) {
	await connectToDatabase();

	const { ObjectId } = await request.json();
	const authHeader = request.headers.get('authorization');

	if (!ObjectId || !isValidObjectId(ObjectId)) {
		return NextResponse.json({ error: "ObjectId is required and needs to be a valid Id" }, { status: 400 });
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({ error: "Authorization header is missing or invalid" }, { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { username } = decoded;
		const tweetToDelete = await Tweet.findById(ObjectId);

		if (!tweetToDelete) {
			return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
		}

		if (tweetToDelete.username === username) {
			await Tweet.findByIdAndDelete(ObjectId);
			return NextResponse.json({ message: 'Tweet deleted successfully' }, { status: 200 });
		} else {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}
