"use client"
import { spaceGrotesk } from '@/app/page';
import { verifyToken } from '@/lib/auth';
import { AvatarIcon, EnterIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {useState,useEffect} from 'react';

const SideBar = () => {
	const [session, setSession] = useState(false);
	useEffect(() => {
		const localToken = Cookies.get("token");
		if (localToken) {
			setSession(true);
			console.log(localToken);
			const user_name = verifyToken(localToken);
			if (!user_name) {
				console.error("unable to verify username :", user_name);
				setSession(false);
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
          <h1 className="font-bold hidden sm:inline-block text-3xl ">TWEET</h1>
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

      {/* Traditional Navbar for smaller screens */}
      <div 
        className="border-b border-white w-full sm:hidden bg-gray-950 text-white h-16 px-5 fixed flex flex-row justify-between items-center"
      >
				<Link href="/">
				<h1 className="font-bold sm:hidden text-2xl">TWEETY</h1>
				</Link>
        { session ?(<Link href="/profile">
          <AvatarIcon className="w-10 h-10 p-1 border border-blue-500 rounded-full hover:bg-blue-400/30 transition-all duration-150" color='white'/>
        </Link>):(
				<div className='flex items-center gap-1'>
				<Link href="/signup">
          <PlusCircledIcon className="w-10 h-10 p-1 border border-blue-500 rounded-full hover:bg-blue-400/30 transition-all duration-150" color='white'/>
        </Link>
				<div className='h-9 w-[1px] bg-gray-400 '/>
				<Link href="/login">
          <EnterIcon className="w-10 h-10 p-1 border border-blue-500 rounded-full hover:bg-blue-400/30 transition-all duration-150" color='white'/>
        </Link>
				</div>
				)}
				
      </div>
    </>
  );
};

export default SideBar;
