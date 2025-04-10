"use client"
import Link from 'next/link'
import React from 'react'
import { IoHome } from "react-icons/io5";
import { LuTv } from "react-icons/lu";
import { BiMoviePlay } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { usePathname } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { openMobileSearch } from '@/store/movieSlice';

const MobileNavigation = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();

    const isMobileSearchVisible = useSelector(state => state.movieData.isMobileSearchVisible);

    const linkBaseClass = 'flex flex-col items-center text-neutral-400 text-xs'
    const linkActiveClass = 'text-purple-700 font-bold scale-115'

    const isActive = (href) => pathname === href;

    const handleSearchClick = () => {
        dispatch(openMobileSearch());
    };

    return (
        <section className={`lg:hidden h-14 bg-black/90 backdrop-blur-sm opacity-80 fixed bottom-0 border-t w-full z-40 transition-opacity duration-300 ${isMobileSearchVisible ? 'opacity-0 pointer-events-none' : 'opacity-80'}`}>
            
                <div className='flex items-center justify-around h-full'>
                    <Link
                        href="/"
                        className={`${linkBaseClass} ${isActive("/") ? linkActiveClass : ""}`}
                    >
                        <IoHome size={22} color='purple'/>
                        <div className='text-purple-500'>Home</div>
                    </Link>
                    <Link
                        href="/explore/tv"
                        // Match the actual path you navigate to
                        className={`${linkBaseClass} ${pathname.startsWith('/explore/tv') ? linkActiveClass : ''}`}
                    >
                        <LuTv size={22} color='purple'/>
                        <div className='text-purple-500'>TV Shows</div>
                    </Link>
                    <Link
                        href="/explore/movie"
                        // Match the actual path you navigate to
                        className={`${linkBaseClass} ${pathname.startsWith('/explore/movie') ? linkActiveClass : ''}`}
                    >
                        <BiMoviePlay size={22} color='purple' />
                        <div className='text-purple-500'>Movies</div>
                    </Link>
                    
                    <button
                        onClick={handleSearchClick}
                        className={`${linkBaseClass} cursor-pointer` } // Use base class, no active state needed here
                        aria-label="Open search input"
                    >
                        <CiSearch size={22} color='purple' />
                        <div className='text-purple-500'>Search</div>
                    </button>

                </div>
            
        </section >
    )
}

export default MobileNavigation
