"use client";

import { logout, verifyToken } from "@/lib/auth";
import { AvatarIcon } from "@radix-ui/react-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      // Retrieve token from sessionStorage
      const localToken = Cookies.get('token') // This should print the JWT token

      // If token is found, set the state and verify it
      if (localToken) {
        setToken(localToken);
        const userName = verifyToken(localToken);
        
        // If username is valid, set the username state, else redirect to login
        if (userName) {
          setUserName(userName);
        } else {
          console.error("Unable to verify Username");
          router.push("/login");
        }
      } else {
        // If no token is found, redirect to login
        console.error("Unable to get token");
        router.push("/login");
      }
    }
  }, [router]);

  // If token or username is not available, don't render the profile
  if (!token || !userName) {
    return null; // Or render a loading spinner, etc.
  }

  return (
    <div className="flex flex-col mt-10 items-center w-full justify-around gap-2">
      <AvatarIcon className="h-10 w-10" />
      <p>{userName}</p>
      <button
        className="w-fit mt-3 p-3 rounded-lg bg-blue-500"
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
};

export default Profile;
