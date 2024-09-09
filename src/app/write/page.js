"use client";

import { verifyToken } from "@/lib/auth";
import { AvatarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { spaceGrotesk } from "../page";
import io from "socket.io-client"; // Import Socket.IO client

const socket = io("https://tweety-by-tharun.netlify.app:3001");

const Write = () => {
  const [content, setContent] = useState("");
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      const localToken = Cookies.get('token')
      if (localToken) {
        setToken(localToken);
        const username = verifyToken(localToken);
        if (username) {
          setUserName(username);
        } else {
          console.error("Unable to verify Username");
          router.push("/login");
        }
      } else {
        console.error("Unable to get token");
        router.push("/login");
      }
    }
  }, [router]);

  async function handlePost(e) {
    e.preventDefault();
    try {
      socket.emit('newTweet', { content, userId : userName });

      if (!res.ok) {
        throw new Error("Failed to post tweet");
      }

      const data = await res.json();
      console.log(data);

      // Redirect or update UI after successful post
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${spaceGrotesk.className} flex flex-col w-full gap-3`}>
      <div className="flex flex-row gap-3">
        <AvatarIcon color="white" className="h-7 w-7" />
        <p>{userName}</p>
      </div>
      <div className="w-full">
        <textarea
          onChange={(e) => setContent(e.target.value)}
          className={`${spaceGrotesk.className} w-full h-50 rounded-lg p-5 bg-gray-800`}
          value={content}
        />
      </div>
      <button
        className={`${spaceGrotesk.className} w-fit p-4 py-2 bg-primary rounded-full text-black font-bold`}
        onClick={handlePost}
      >
        POST
      </button>
    </div>
  );
};

export default Write;
