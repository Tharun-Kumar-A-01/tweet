import Cookies from "js-cookie";

export const logout = () => {
	if (typeof window !== "undefined") {
		Cookies.remove("token");
	}
};
