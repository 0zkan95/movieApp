"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import Image from 'next/image';



const PLACEHOLDER_BACKDROP_URL = '/backdrop-placeholder.png';

const BannerHome = () => {

    const bannerData = useSelector(state => state.movieData.bannerData)
    const imageBaseUrl = useSelector(state => state.movieData.imageURL)



    const [currentImage, setCurrentImage] = useState(0)

    const handleNext = useCallback(() => {
        setCurrentImage(prev =>
            prev < bannerData.length - 1 ? prev + 1 : 0
        );
    }, [bannerData.length]);

    const handlePrev = useCallback(() => {
        setCurrentImage(prev =>
            prev > 0 ? prev - 1 : bannerData.length - 1
        );
    }, [bannerData.length]);

    useEffect(() => {

        if (bannerData.length > 1) {
            const intervalId = setInterval(() => {
                handleNext();
            }, 5000); //millisec

            // Cleanup function 
            return () => clearInterval(intervalId);
        }
    }, [bannerData.length, handleNext]);

    // -- Handle image loading errors
    const handleImageError = (e) => {
        if (e.target.src !== PLACEHOLDER_BACKDROP_URL) {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_BACKDROP_URL;
        }
    };

    // -- Render fallback if no data or base URL
    if (!imageBaseUrl || bannerData.length === 0) {
        return (
            <section className='flex items-center justify-center w-full h-[450px] lg:h-[95vh] bg-neutral-800 text-white'>
                Loading Banner...

            </section>
        );
    }

    return (

        <section className='relative w-full h-[450px] lg:h-[95vh] overflow-hidden'>
            {/* Sliding Container */}
            <div
                className='flex h-full transition-transform duration-700 ease-in-out' // Slightly longer duration
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
                {/* Map through banner data to create slides */}
                {bannerData.map((data, index) => {
                    // Basic data validation for each item
                    if (!data || !data.id) return null;

                    const {
                        id,
                        backdrop_path,
                        poster_path,
                        title,
                        name,
                        overview,
                        vote_average,
                        popularity
                    } = data;

                    // Prefer backdrop, fallback to poster
                    const imagePath = backdrop_path ?? poster_path;
                    const backdropSize = "original"; // Use 'original' or 'w1280' for backdrops
                    const fullImageUrl = imageBaseUrl && imagePath
                        ? `${imageBaseUrl}${backdropSize}${imagePath}`
                        : PLACEHOLDER_BACKDROP_URL;

                    const displayName = title || name || "Untitled";
                    const displayOverview = overview || "No overview available.";
                    const displayRating = vote_average ? Number(vote_average).toFixed(1) : null;
                    const displayPopularity = popularity ? Number(popularity).toFixed(0) : null;

                    return (
                        <div
                            key={id}
                            className='relative flex-shrink-0 w-full h-full'
                        >
                            {/* Background Image using next/image */}

                            <Image
                                src={fullImageUrl}
                                alt={`Backdrop for ${displayName}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={index === 0} // Prioritize loading the first image
                                sizes="100vw" // Image takes full viewport width
                                onError={handleImageError}
                                unoptimized={!imagePath} // Don't optimize placeholder
                            />

                            {/* Dark Overlay Gradient for text contrast */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>

                            {/* Content Overlay */}
                            <div className='absolute bottom-0 left-0 flex flex-col justify-end p-4 md:p-8 lg:p-12 text-neutral-400 z-10'>
                                <div className='container mx-auto max-w-3xl'>
                                    <h2 className='text-purple-500 font-bold text-3xl text-left md:text-4xl lg:text-5xl mb-2 text-shadow-md'>
                                        {displayName}
                                    </h2>
                                    <p className='text-sm text-left md:text-base text-ellipsis line-clamp-3 mb-4 leading-relaxed text-shadow-sm'>
                                        {displayOverview}
                                    </p>
                                    <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm mb-4 font-medium'>

                                        <button className='hover:scale-105 px-5 py-2 font-semibold bg-white/20 text-purple-500 rounded-lg border border-purple/50 backdrop-blur-sm transition-all duration-300  text-sm md:text-base'>
                                            Watch Now
                                        </button>
                                        {displayRating && (
                                            <span className='flex items-center'>
                                                <FaStar className='text-yellow-400 mr-1' /> {displayRating}+ Rating
                                            </span>
                                        )}
                                        {displayRating && displayPopularity && <span>|</span>}
                                        {displayPopularity && (
                                            <span>Popularity: {displayPopularity}</span>
                                        )}
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons (Desktop Only - placed outside the sliding container) */}
            <div className='absolute inset-y-0 left-0 right-0 items-center justify-between text-white lg:flex hidden z-20'>
                {/* Added z-index */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className='absolute -left-2 top-1/2 -translate-y-1/2 ml-4 p-3 bg-black/30 rounded-full text-purple-500 duration-300 cursor-pointer hover:scale-110'
                >
                    <FaChevronLeft size={30} /> 
                </button>
                <button
                    onClick={handleNext}
                    aria-label="Next slide"
                    className='absolute -right-2 top-1/2 -translate-y-1/2 mr-4 p-3 bg-black/30 rounded-full text-purple-500 duration-300 cursor-pointer hover:scale-110'
                >
                    <FaChevronRight size={30} /> 
                </button>
            </div>
        </section>
    )
}

export default BannerHome
