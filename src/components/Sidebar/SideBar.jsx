import { AvatarIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';

const SideBar = () => {
  return (
    <>
      {/* Sidebar for larger screens */}
      <div 
        className="border-r border-white hidden sm:flex sm:w-1/4 md:w-1/6 bg-gray-950 text-white pt-10 h-full fixed flex-col justify-between items-center"
        style={{ zIndex: 1000 }} // Adjust z-index if necessary
      >
        <div className="flex w-full flex-col gap-10 items-center">
          <h1 className="font-bold hidden sm:inline-block text-3xl">TWEETY</h1>
					<Link href="/">
          <button className="p-3 bg-blue-500 rounded-lg" >Tweets</button>
					</Link>
        </div>
        <div className="flex flex-col w-fit gap-2 items-center">
					<Link href="/profile">
          <button className='p-3 bg-blue-500 rounded-lg' >Profile</button>
					</Link>
        </div>
      </div>

      {/* Bottom bar for smaller screens */}
      <div 
        className="border-b border-white w-full sm:hidden bg-gray-950 text-white h-16 px-5 fixed flex flex-row justify-between items-center"
        style={{ zIndex: 1000 }} // Adjust z-index if necessary
      >
				<Link href="/">
        <button className="p-3 bg-blue-500 rounded-lg">Tweets</button>
				</Link>
        <Link href="/profile">
          <AvatarIcon className="w-7 h-7 " color='white'/>
        </Link>
      </div>
    </>
  );
};

export default SideBar;
