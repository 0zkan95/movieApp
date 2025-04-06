"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
import { useRouter, useSearchParams } from 'next/navigation';



const Header = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const [searchInput, setSearchInput ] = useState(initialQuery);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if(searchInput) {
                router.push(`/search?q=${encodeURIComponent(searchInput)}`);  //push only if there is actual search input
            } else {
                router.push('/'); // if it is not actual search input go back search page
            }
        }, 500)
        // cleanup the function
        return () => clearTimeout(handler);

    },[searchInput])  //Re-run the effect only when searchInput changes

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <header className='fixed top-0 w-full h-16 bg-neutral-900 opacity-75 z-10'>
            <div className='container mx-auto px-2 flex items-center h-full'>
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={200} height={160} />
                </Link>

                <nav className='hidden lg:flex px-4 ml-6'>
                    <Link href="#tv" className='ml-4  text-neutral-600 hover:text-neutral-100'>TV Shows</Link>
                    <Link href="movies" className='ml-4 text-neutral-600 hover:text-neutral-100'> Movies </Link>
                </nav>

                <div className='flex items-center gap-5 ml-auto'>
                    <form className='items-center gap-2 flex' onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder='Search...' 
                            className='bg-transparent border-2 rounded-lg px-4 hidden lg:block' 
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
