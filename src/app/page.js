"use client";
import Tweet from "@/components/tweet/Tweet";
import { useState, useEffect } from "react";
import { verifyToken } from "@/lib/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { Pencil1Icon } from "@radix-ui/react-icons";
import io from "socket.io-client"; // Import Socket.IO client

const socket = io("wss://tweety-by-tharun.netlify.app:3001");

export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Home() {
	const [tweets, setTweets] = useState();
	const [session, setSession] = useState(false);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState("");
	useEffect(() => {
		const tokenFromStorage = Cookies.get("token");
		if (tokenFromStorage) {
			setSession(true);
			setToken(tokenFromStorage);
			console.log(tokenFromStorage);
			const user_name = verifyToken(token);
			if (!user_name) {
				console.error("unable to verify username :", user_name);
				setSession(false);
			}
		}

		socket.on('oldTweets', (oldTweets) => {
      setTweets(oldTweets);
			setLoading(false)
    });

    // Listen for new tweets
    socket.on('newTweet', (tweet) => {
      setTweets((prev) => [tweet, ...prev]);
    });

    // Listen for tweet likes
    socket.on('updateTweet', (updatedTweet) => {
      setTweets((prev) =>
        prev.map((tweet) =>
          tweet._id === updatedTweet._id ? updatedTweet : tweet
        )
      );
    });

		socket.on('deleteTweet', (tweetId) => {
      setTweets((prev) => prev.filter((tweet) => tweet._id !== tweetId));
    });

    return () => {
      socket.off('oldTweets');
      socket.off('newTweet');
      socket.off('updateTweet');
			socket.off('deleteTweet');
    };
	}, [token]);

 	return (
		<div>
			<h1 className="text-2xl font-bold mb-3">Tweets</h1>
			{loading ? (
				<div className="absolute top-1/2 left-1/2 h-12 w-12 rounded-full border-l-2 border-t-2 border-white animate-spin"></div>
			) : tweets.length > 0 ? (
				tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
			) : (
				<p>No tweets available</p>
			)}
			<Link href="/write">
				<button
					className={`${spaceGrotesk.className} hidden sm:flex flex-row gap-2 align-middle pt-3 justify-center absolute right-5  px-4 py-2 bg-primary rounded-full text-black font-bold bottom-5`}
				>
					<span className="hidden sm:block">WRITE</span>{" "}
					<Pencil1Icon strokeWidth={3} className="w-5 h-5" />
				</button>
				<button
					className={`${spaceGrotesk.className} sm:hidden absolute right-5  p-3 bg-primary rounded-full text-black font-bold bottom-5`}
				>
					<Pencil1Icon strokeWidth={3} className="w-6 h-6" />
				</button>
			</Link>
		</div>
	);
}
