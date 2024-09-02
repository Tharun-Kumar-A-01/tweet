"use client";
import Tweet from "@/components/tweet/Tweet";
import { useState, useEffect } from "react";
import { verifyToken } from "@/lib/auth";
import Cookies from "js-cookie";
import Link from "next/link";
import { Space_Grotesk } from 'next/font/google'

export const spaceGrotesk = Space_Grotesk({subsets:["latin"]})

export default function Home() {
  const [tweets, setTweets] = useState([{_id:1,content:"sample",username:"user1",likes:200}]);
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);
	const [token, setToken] = useState("")
  useEffect(() => {
    const tokenFromStorage = Cookies.get('token');
    if (tokenFromStorage) {
      setSession(true);
			setToken(tokenFromStorage)
      console.log(tokenFromStorage)
      const user_name = verifyToken(token);
      if (!user_name) {
        console.error("unable to verify username :",user_name);
        setSession(false);
      }
    }

    const fetchTweets = async () => {
      try {
        const res = await fetch("/api/tweet", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setTweets(data.tweets);
					console.log(data)
        } else {
          console.error("Failed to fetch tweets:", await res.text());
        }
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }    
    };

    fetchTweets();
  },[setSession,setToken,token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Tweets</h1>
      {loading ? <p>Loading...</p> : (
        tweets.length > 0 ? (
          tweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))
        ) : (
          <p>No tweets available</p>
        )
      )}
			<Link href="/write">
      <button className={`${spaceGrotesk.className} absolute right-5 p-4 py-2 bg-primary rounded-full text-black font-bold bottom-5`}>
        WRITE
      </button>
			</Link>
    </div>
  );
}
