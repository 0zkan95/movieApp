"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { closeMobileSearch } from '@/store/movieSlice';



const MobileSearchInput = () => {

    const isVisible = useSelector(state => state.movieData.isMobileSearchVisible);
    const dispatch = useDispatch();
    const router = useRouter();

    const [searchInput, setSearchInput] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isVisible]);

    // --- Handlers ---
    const handleCloseClick = () => {
        dispatch(closeMobileSearch()); // Dispatch close action
        setSearchInput(''); // Clear local input state
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedInput = searchInput.trim();
        if (trimmedInput) {
            router.push(`/search?q=${encodeURIComponent(trimmedInput)}`);

        } else {
            if (inputRef.current) inputRef.current.focus();
            console.log("Search input is empty.");
        }
    }

    // --- Render Logic ---
    // Only render if isVisible is true
    if (!isVisible) {
        return null;
    }


    return (
        <div className='lg:hidden sticky top-16 w-full z-40 bg-black-100 shadow-md p-3 border-b border-purple-400'>
            <form className='flex items-center w-full' onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search movies or TV shows...'
                    className='flex-grow  border border-purple-500 rounded-l-md px-3 py-1.5 text-sm text-purple-500 focus:outline-none focus:border-purple-500'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <button
                    type="submit"
                    className='p-2 text-sm bg-purple-500 rounded-r-md cursor-pointer  transition-all duration-300  active:bg-purple-800 active:scale-95'
                    aria-label='Search'
                >
                    <CiSearch size={20} />
                </button>

                <button
                    type="button" // Important: type="button" to prevent form submit
                    onClick={handleCloseClick}
                    className='p-2 text-neutral-400 hover:text-white ml-2 flex-shrink-0' // Added flex-shrink-0
                    aria-label="Close search input"
                >
                    <IoMdClose size={24} color='purple' className='cursor-pointer' />
                </button>
            </form>
        </div>
    )
}

export default MobileSearchInput;
