"use client";
import { AvatarIcon, HeartFilledIcon, HeartIcon, TrashIcon } from "@radix-ui/react-icons";
import React,{ useState,useEffect } from "react";
import { verifyToken } from "@/lib/auth"; // Ensure these functions are correctly defined and imported
import Cookies from "js-cookie";
import { spaceGrotesk } from "@/app/page";

const Tweet = ({ tweet }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isOwn,setIsOwn] = useState(false);
	const [liked,setLiked] = useState(false)

	useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      const localToken = Cookies.get('token')
      if (localToken) {
        setToken(localToken);
        const user_name = verifyToken(localToken);
        if (user_name) {
          setUserName(user_name);
					if(tweet.likes.includes(user_name)){
						setLiked(true)
					}
		  if(user_name === tweet.username) {
			  setIsOwn(true);
		  }
        } else {
          console.warn("Error verifying username");
        }
      } else {
        console.warn("No token token found. Anonymus access");
      }
    }
  },[tweet.username,tweet.likes]);

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
				setLiked((prev)=>!prev)
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
    <div className={`${spaceGrotesk.className} w-full max-w-2xl mt-5 h-fit flex flex-row gap-2 justify-start align-top`}>
		<div className="flex flex-col justify-between">
			<AvatarIcon color="white" className="h-7 w-7" />
			{ isOwn && <button onClick={(e) => handleDelete(e, tweet._id)} className="h-fit w-fit p-2 bg-red-500 rounded-lg"><TrashIcon className="h-5 w-5"/></button>}
			</div>
      <div className="flex flex-col gap-1">
        <div><p>{tweet.username}</p></div>
        <div className="flex flex-row justify-between items-center gap-3 h-full">
          <div className={`${spaceGrotesk.className} p-4 py-2 rounded-2xl rounded-tl-none bg-gray-800`}>
            {tweet.content}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <button className="h-fit" onClick={(e) => handleLike(e, tweet._id)}>
						{liked ?(
							<HeartFilledIcon className="text-red-500 h-4 w-4"/>
						):(
							<HeartIcon className="text-red-500 h-4 w-4"/>
						)}
          </button>
          <p className={`${spaceGrotesk.className} text-xs text-gray-600`}>{tweet.likes.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
