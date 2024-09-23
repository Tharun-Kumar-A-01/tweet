import Cookies from "js-cookie";
import { jwtVerify, SignJWT } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// Token retrieval function (runs on client-side)
export const signToken = async (username) => {
	const token = await new SignJWT({ username })
		.setProtectedHeader({ alg: "HS256" })
		.sign(secretKey);

	return token;
};

// Token verification function (runs on server-side)
export const verifyToken = async (token) => {
	try {
		if (!token) {
			throw new Error("Token not found");
		}

		const { payload } = await jwtVerify(token, secretKey);
		return payload.username;
	} catch (error) {
		console.log(error);
		return null;
	}
};

// Logout function (runs on client-side)
export const logout = () => {
	if (typeof window !== "undefined") {
		Cookies.remove("token");
	}
};
