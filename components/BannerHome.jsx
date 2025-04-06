"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


const BannerHome = () => {

    const bannerData = useSelector(state => state.movieData.bannerData)
    const imageURL = useSelector(state => state.movieData.imageURL)

    const [currentImage, setCurrentImage] = useState(0)
    const handleNext = () => {
        if(currentImage < bannerData.length - 1) {
            setCurrentImage(prev => prev + 1)
        } else {
            setCurrentImage(0)
        }
    }

    const handlePrev = () => {
        if(currentImage > 0) {
            setCurrentImage(prev => prev - 1)
        } else {
            setCurrentImage(bannerData.length - 1)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if(currentImage < bannerData.length - 1) {
                handleNext()
            } else {
                setCurrentImage(0)
            }

        }, 4000)
        
        return () => clearInterval(intervalId)
    }, [bannerData.length, imageURL, currentImage])

    return (
        <section className='w-full h-full'>
            <div className='flex min-h-full max-h-[95vh]'>
                {imageURL && bannerData.map((data, index) => {
                    const imagePath = data.backdrop_path || data.poster_path;
                    if (!imagePath) {
                        return null;
                    }

                    const fullImageUrl = `${imageURL}${imagePath}`;

                    return (
                        <div 
                            key={index} 
                            className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative transition-all ease-in-out'
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}    
                        >
                            <div className='w-full h-full'>
                                <img
                                    src={fullImageUrl}
                                    alt={data.name || data.title}
                                    className='h-full w-full object-cover'
                                />
                            </div>

                            {/* next and prev button */}
                            <div className='absolute top-0 h-full w-full items-center justify-between text-white lg:flex'>
                                <button 
                                    className='hover:text-[#F17FFF] hover:cursor-pointer z-10 transition-all duration-300 hover:scale-105'
                                    onClick={handlePrev}
                                >
                                    <FaChevronLeft />
                                </button>
                                <button 
                                    className='hover:text-[#F17FFF] hover:cursor-pointer z-10 transition-all duration-300 hover:scale-105'
                                    onClick={handleNext}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                            <div className='absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent'>

                            </div>
                            <div className='container mx-auto absolute bottom-4 max-w-md px-3'>
                                <h2 className='font-bold text-2xl lg:text-4xl'>{data?.title || data?.name}</h2>
                                <p className='text-white text-[1rem] text-left text-ellipsis line-clamp-3 my-1 leading-6'> {data.overview} </p>
                                <div className='flex items-center gap-4'>
                                    <p className='ml-2 text-sm'>Rating: {Number(data.vote_average).toFixed(1)}+ </p>
                                    <span className='text-sm'>|</span>
                                    <p className='ml-2 text-sm'> View: {Number(data.popularity).toFixed(0)} </p>
                                </div>
                                <div className='flex items-center justify-start ml-4 mt-4 '>
                                    <button className='px-4 py-2 font-bold border-1 text-sm rounded-2xl hover:cursor-pointer hover:bg-[#F17FFF] hover:text-white transition-all duration-300 hover:scale-105'>
                                        Watch Now
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default BannerHome
