"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';



const Header = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialQuery = searchParams.get('q') || '';
    const [searchInput, setSearchInput ] = useState(initialQuery);
    
    useEffect(() => {

        if (!searchInput && pathname.startsWith('/search')) {
            return;
        }

        const handler = setTimeout(() => {
            if(searchInput) {
                router.push(`/search?q=${encodeURIComponent(searchInput)}`);  //push only if there is actual search input
            } 

        }, 500)
        // cleanup the function
        return () => clearTimeout(handler);

    },[searchInput])  //Re-run the effect only when searchInput changes

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <header className='fixed top-0 w-full h-16 bg-neutral-900 opacity-75 z-40'>
            <div className='container mx-auto px-4 flex items-center h-full'>
                <Link href="/">
                    <Image 
                        src="/logo.png" 
                        alt="logo" 
                        width={200} 
                        height={160} 
                        priority 
                        className='h-10 w-auto'
                    />
                </Link> 

                <nav className='hidden lg:flex px-4 ml-6'>
                    <Link href="/explore/tv" className='ml-4  text-purple-600 hover:text-purple-100'>TV Shows</Link>
                    <Link href="/explore/movie" className='ml-4 text-purple-600 hover:text-purple-100'> Movies </Link>
                </nav>

                <div className='flex items-center gap-5 ml-auto '>
                    <form 
                        className='items-center justify-around gap-2 hidden lg:flex' 
                        onSubmit={handleSubmit}
                    >
                        <input 
                            type="text" 
                            placeholder='Search...' 
                            className='bg-transparent border-2 rounded-lg px-4 ' 
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={searchInput}
                        />
                        <button className='cursor-pointer'>
                            <MdOutlineScreenSearchDesktop size={30} />
                        </button>
                    </form>
                    
                    <div className='w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                        <Image
                            src="/user.png"
                            alt='user'
                            width={40}
                            height={30}
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
