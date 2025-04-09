"use client"
import Link from 'next/link'
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { IoHome } from "react-icons/io5";
import { LuTv } from "react-icons/lu";
import { BiMoviePlay } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io"; // Added close icon
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter


const MobileNavigation = () => {
    const pathname = usePathname();
    const router = useRouter()

    // --- State for search visibility and input value
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const inputRef = useRef(null);  // -- Ref for focusing the input

    const linkBaseClass = 'flex flex-col items-center text-neutral-400 text-xs'
    const linkActiveClass = 'text-purple-700 font-bold scale-115'

    const isActive = (href) => pathname === href;

    useEffect(() => {
        if (!isSearchVisible) {
            return;
        }

        const handler = setTimeout(() => {
            if (searchInput) {
                router.push(`/search?q=${encodeURIComponent(searchInput)}`)
            }
            
        }, 500);
        return () => clearTimeout(handler);  //cleanup function

    }, [searchInput, isSearchVisible, router]);   //-- dependencies re-run when input or visibility changes


    useEffect(() => {
        if (isSearchVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchVisible]);


    const handleSearchClick = () => {
        setIsSearchVisible(true);
    }

    const handleCloseClick = () => {
        setIsSearchVisible(false);
        setSearchInput('');    //-- clear input on close
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchInput) {
            router.push(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    }

    return (
        <section className='lg:hidden h-14 bg-black/90 backdrop-blur-sm opacity-80 fixed bottom-0 border-t w-full z-40'>


            {/**  Conditional Rendering: Show nav Icons or Search Input */}
            {!isSearchVisible ? (
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
                        <div className='text-purple-500's>Movies</div>
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
            ) : (
                // -- Search Input View
                <div className='flex items-center justify-between px-3 h-full'>
                    <form className='flex-grow flex items-center' onSubmit={handleSubmit}>
                        <input
                            ref={inputRef} // Assign ref
                            type="text"
                            placeholder='Search movies or TV shows...'
                            className='bg-neutral-800 border border-neutral-600 rounded-md px-3 py-1.5 text-sm text-purple-500 focus:outline-none focus:border-neutral-400 w-full'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                    <button
                        onClick={handleCloseClick}
                        className='p-2 text-neutral-400 hover:text-white ml-2'
                        aria-label="Close search input"
                    >
                        <IoMdClose size={24} color='purple' className='cursor-pointer' />
                    </button>
                </div>
            )}

        </section >
    )
}

export default MobileNavigation
