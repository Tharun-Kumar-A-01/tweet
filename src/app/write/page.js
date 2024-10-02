"use client";

import { AvatarIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { spaceGrotesk } from "../page";
import AuthContext from "../layout";

const Write = () => {
	const [content, setContent] = useState("");
	const [token, setToken] = useState(null);
	const user = useContext(AuthContext);
	const userName = user?.username;
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

	async function handlePost(e) {
		e.preventDefault();
		try {
			const res = await fetch("/api/tweet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					content,
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to post tweet");
			}

			const data = await res.json();
			console.log(data);

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
				className={`${spaceGrotesk.className} w-fit p-4 py-2 flex flex-row gap-2 align-middle bg-primary rounded-full text-black font-bold`}
				onClick={handlePost}
			>
				POST <PaperPlaneIcon strokeWidth={3} className="w-5 h-5" />
			</button>
		</div>
	);
};

export default Write;
