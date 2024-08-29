"use client";
import { AvatarIcon, HeartIcon } from "@radix-ui/react-icons";
import React from "react";
import { verifyToken } from "@/lib/auth"; // Ensure these functions are correctly defined and imported
import Cookies from "js-cookie";

const Tweet = ({ tweet, isUser }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      const localToken = Cookies.get('token')
      if (localToken) {
        setToken(localToken);
        const userName = verifyToken(localToken);
        if (userName) {
          setUserName(userName);
        } else {
          console.warn("Error verifying username");
        }
      } else {
        console.warn("No token token found. Anonymus access");
      }
    }
  },[setToken,setUserName]);

  const handleLike = async (e, ObjectId) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tweet/like", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Corrected 'Authentication' to 'Authorization'
        },
        body: JSON.stringify({ ObjectId })
      });

      const data = await res.json(); // Parse response data
      if (res.ok) {
        console.log(data);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e, ObjectId) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tweet", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Corrected 'Authentication' to 'Authorization'
        },
        body: JSON.stringify({ ObjectId })
      });

      const data = await res.json(); // Parse response data
      if (res.ok) {
        console.log(data);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-5 h-fit flex flex-row justify-start align-top">
			<AvatarIcon color="white" className="h-7 w-7" />
      <div className="flex flex-col">
        <div><p>{tweet.username}</p></div>
        <div className="flex flex-row justify-between items-center gap-3 h-full">
          <div className="p-3 rounded-lg rounded-tl-none bg-gray-800">
            {tweet.content}
          </div>
          {isUser && (
            <button onClick={(e) => handleDelete(e, tweet.ObjectId)} className="h-fit w-fit p-3 bg-blue-500 rounded-lg">
              Delete
            </button>
          )}
        </div>
        <div className="flex flex-row items-center">
          <button className="h-fit" onClick={(e) => handleLike(e, tweet.ObjectId)}>
            <HeartIcon color="red" />
          </button>
          <p className="text-xs text-gray-600">{tweet.likes}</p>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
