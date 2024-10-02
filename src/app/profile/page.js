"use client";

import { logout } from "@/lib/auth";
import { AvatarIcon } from "@radix-ui/react-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { spaceGrotesk } from "@/app/page";
import AuthContext from "../layout";

const Profile = () => {
	const [token, setToken] = useState(null);	
	const user = useContext(AuthContext);
	const userName = user?.username;;
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const localToken = Cookies.get("token");
			if (localToken) {
				setToken(localToken);
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
				className={`${spaceGrotesk.className} p-4 py-2 border bg-transparent border-primary rounded-full font-bold text-primary`}
				onClick={logout}
			>
				LOG OUT
			</button>
		</div>
	);
};

export default Profile;
