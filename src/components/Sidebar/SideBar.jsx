"use client"
import { spaceGrotesk } from '@/app/page';
import { verifyToken } from '@/lib/auth';
import { AvatarIcon } from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {useState,useEffect} from 'react';

const SideBar = () => {
	const [session, setSession] = useState(false);

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window !== "undefined") {
      const localToken = Cookies.get('token')
      if (localToken && verifyToken(localToken)) {
        setSession(true)
      }
    }
  },[]);
  return (
    <>
      {/* Sidebar for larger screens */}
      <div 
        className="border-r border-white hidden sm:flex sm:w-1/4 md:w-1/6 bg-gray-950 text-white pt-10 h-full fixed flex-col justify-between items-center"
      >
        <div className="flex w-full flex-col gap-10 items-center">
					<Link href="/">
          <h1 className="font-bold hidden sm:inline-block text-3xl">TWEETY</h1>
					</Link>
        </div>
        <div className="flex flex-col w-fit gap-2 items-center mb-3">
					{
						session ? (<Link href="/profile">
							<button className={`${spaceGrotesk.className} p-4 py-2 bg-primary rounded-full text-black font-bold`} >PROFILE</button>
							</Link>):(
								<>
								<Link href="/login">
								<button className={`${spaceGrotesk.className} p-6 py-2 bg-primary rounded-full w-max text-black font-bold`} >LOG IN</button>
								</Link>
								<Link href="/signup">
								<button className={`${spaceGrotesk.className} p-4 py-2 border bg-transparent border-primary rounded-full font-bold text-primary`} >SIGN UP</button>
								</Link>
								</>
							)
					}
        </div>
      </div>

      {/* Bottom bar for smaller screens */}
      <div 
        className="border-b border-white w-full sm:hidden bg-gray-950 text-white h-16 px-5 fixed flex flex-row justify-between items-center"
      >
				<Link href="/">
				<h1 className="font-bold sm:hidden text-2xl">TWEETY</h1>
				</Link>
        <Link href="/profile">
          <AvatarIcon className="w-8 h-8 p-1  rounded-full hover:bg-blue-400/30 transition-all duration-150" color='white'/>
        </Link>
      </div>
    </>
  );
};

export default SideBar;
