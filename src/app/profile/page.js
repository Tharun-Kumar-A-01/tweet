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
		if (typeof window !== "undefined") {
			const localToken = Cookies.get("token");
			if (localToken) {
				setToken(localToken);
				const userName = verifyToken(localToken);
				if (userName) {
					setUserName(userName);
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

	if (!token || !userName) {
		return null;
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
