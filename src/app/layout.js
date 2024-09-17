import "./globals.css";
import SideBar from "@/components/Sidebar/SideBar";

export const metadata = {
  title: "tweet",
  description: "Share your thoughts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-white bg-gray-950 flex flex-col sm:flex-row w-screen  min-h-screen">
        <SideBar />
        <div className="flex-grow mt-16 sm:mt-0 sm:ml-[25%] md:ml-[20%] p-5">
          {children}
        </div>
      </body>
    </html>
  );
}
