"use client";
import Cookies from "js-cookie";
import "./globals.css";
import SideBar from "@/components/Sidebar/SideBar";
import { createContext,useState } from "react";
/* 
export const metadata = {
  title: "Tweet",
  description: "Share your thoughts",
};
 */
const AuthContext = createContext(null);

export default function RootLayout({ children }) {
	
	const token = Cookies.get("token")
	const [userName,setUserName] = useState("")
	if(token) {
		const res = fetch("/api/auth/verify/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			}
		})
		if(res.ok) {
			const data = res.json();
			console.log(data);
			
			setUserName(data.username)
		}
	}
	
	return (
    <html lang="en">
      <body className="text-white bg-gray-950 flex flex-col sm:flex-row w-screen  min-h-screen">
				<AuthContext.Provider value={{username:userName}}>
			  <SideBar />
        <div className="flex-grow mt-16 sm:mt-0 sm:ml-[25%] md:ml-[20%] p-5">
          {children}
        </div>
				</AuthContext.Provider>
      </body>
    </html>
  );
}

export { AuthContext }