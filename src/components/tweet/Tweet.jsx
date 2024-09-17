"use client";
import { AvatarIcon, HeartFilledIcon, HeartIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { verifyToken } from "@/lib/auth"; // Ensure these functions are correctly defined and imported
import { spaceGrotesk } from "@/app/page";

const Tweet = ({ tweet, token }) => {
  const [userName, setUserName] = useState(null);
  const [isOwn, setIsOwn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likes.length);

  useEffect(() => {
    try {
      const user_name = verifyToken(token);
      if (user_name) {
        setUserName(user_name);
        setIsOwn(user_name === tweet.username);
        if (tweet.likes.includes(user_name)) {
          setLiked(true);
        }
      }
    } catch (error) {
      console.warn("Error verifying username");
    }
  }, [tweet, token]);

  const handleLike = async (e, ObjectId) => {
    e.preventDefault();
    if (!token) {
      return null;
    }
    try {
      const res = await fetch("/api/tweet/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Corrected 'Authentication' to 'Authorization'
        },
        body: JSON.stringify({ ObjectId }),
      });

      const data = await res.json(); // Parse response data
      if (res.ok) {
        console.log(data);

        // Toggle like state and update the likes count
        if (liked) {
          setLiked(false);
          setLikesCount((prev) => prev - 1);
        } else {
          setLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e, ObjectId) => {
    e.preventDefault();
    if (!token) {
      return null;
    }
    try {
      const res = await fetch("/api/tweet", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Corrected 'Authentication' to 'Authorization'
        },
        body: JSON.stringify({ ObjectId }),
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
        {isOwn && (
          <button
            onClick={(e) => handleDelete(e, tweet._id)}
            className="h-fit w-fit p-2 bg-red-500 rounded-lg"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <p>{tweet.username}</p>
        </div>
        <div className="flex flex-row justify-between items-center gap-3 h-full">
          <div className={`${spaceGrotesk.className} p-4 py-2 rounded-2xl rounded-tl-none bg-gray-800`}>
            {tweet.content}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <button className="h-fit" onClick={(e) => handleLike(e, tweet._id)}>
            {liked ? (
              <HeartFilledIcon className="text-red-500 h-4 w-4" />
            ) : (
              <HeartIcon className="text-red-500 h-4 w-4" />
            )}
          </button>
          <p className={`${spaceGrotesk.className} text-xs text-gray-600`}>{likesCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
