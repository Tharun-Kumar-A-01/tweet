import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Tweet from '@/models/tweet';
import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';

export default async function POST(request) {
	await connectToDatabase();

	const { content } = request.body;
	const authHeader = request.headers.authorization;

	if (!content || typeof content !== 'string') {
		return NextResponse.json({status:400, error:"Content is required and should be string"})
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({status:401, error:"Authorization header is missing or invalid" });
	}

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { username } = decoded;

		const newTweet = new Tweet({ content, username });
		await newTweet.save();

		NextResponse.json({ message: 'Tweet created successfully', tweet: newTweet },{status:201});
	} catch (error) {
	console.error(error);
	NextResponse.json({ error:"Invalid token" },{status:401});
	}

}

export async function GET (request) {
await connectToDatabase();
try {
	const tweetList = Tweet.find()

	NextResponse.json({ tweets:tweetList },{status:201});
} catch (error) {
	console.error(error);
	NextResponse.json({ error:"Internal server error" },{status:501});
}}
export async function DELETE (request) {
	await connectToDatabase();

	const { ObjectId } = request.body;
	const authHeader = request.headers.authorization;

	if (!ObjectId || !isValidObjectId(ObjectId)) {
		return NextResponse.json({ error:"ObjectId is required and needs to be a valid Id"},{status:400})
	}

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({ error:"Authorization header is missing or invalid" },{status:401});
	}

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { username } = decoded;
		const deleteTweet = Tweet.findById(ObjectId);
		if(deleteTweet.username === username){
			Tweet.findByIdAndDelete(ObjectId);
			NextResponse.json({ message: 'Tweet deleted successfully'},{status:201});
		} else {
			throw new Error("Error deleting the Tweet");
		}
	} catch (error) {
		console.error(error);
		NextResponse.json({ error:"Invalid token" },{status:401});
	}

}