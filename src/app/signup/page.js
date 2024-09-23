"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json(); // Parse response as JSON
		if (res.ok) {
			Cookies.set("token", data.token);
			router.push("/");
		} else {
			console.error("Sign-up error:", data.error || "Unknown error");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-full w-full">
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
			>
				<h2 className="text-2xl font-bold mb-4">Sign up</h2>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="w-full p-2 text-black mb-4 border rounded"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full p-2 text-black mb-4 border rounded"
				/>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
				>
					Sign up
				</button>
			</form>
			<p className="mt-4 text-white">
				{"Already have an account? "}
				<Link href="/login" className="text-blue-500 hover:underline">
					Log in
				</Link>
			</p>
		</div>
	);
};

export default SignUp;
