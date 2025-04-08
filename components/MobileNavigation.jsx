"use client"
import Link from 'next/link'
import React from 'react'
import { IoHome } from "react-icons/io5";
import { LuTv } from "react-icons/lu";
import { BiMoviePlay } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { usePathname } from 'next/navigation';


const MobileNavigation = () => {
    const pathname = usePathname();

    const linkBaseClass = 'text-sm items-center flex flex-col text-neutral-600'
    const linkActiveClass = 'text-white font-semibold text-neutral-100'

    const isActive = (href) => pathname === href;

    return (
        <section className='lg:hidden h-14 bg-black opacity-70 fixed bottom-0 w-full z-20'>
            <div className='flex items-center justify-between px-3 h-full'>
                <Link 
                    href="/" 
                    className={`${linkBaseClass} ${isActive("/") ? linkActiveClass : ""}`}
                >
                    <IoHome size={25} className='ml-1' />
                    <div>
                        Home
                    </div>
                </Link>
                <Link 
                    href="/explore/tv" 
                    className={`${linkBaseClass} ${isActive('/tv-shows') ? linkActiveClass : ''}`}
                >
                    <LuTv size={25} className='mx-auto' />
                    <div>
                        TV Shows
                    </div>
                </Link>
                <Link 
                    href="/explore/movie" 
                    className={`${linkBaseClass} ${isActive('/movies') ? linkActiveClass : ''}`}
                >
                    <BiMoviePlay size={25} className='mx-auto' />
                    <div>
                        Movies
                    </div>
                </Link>
                <Link 
                    href="/search" 
                    className={`${linkBaseClass} ${isActive('/search') ? linkActiveClass : ''}`}
                >
                    <CiSearch size={25} className='mx-auto' />
                    <div>
                        Search
                    </div>
                </Link>

            </div>
        </section>
    )
}

export default MobileNavigation
