"use client"
import React from 'react'
import { useSelector } from 'react-redux'


const BannerHome = () => {

    const bannerData = useSelector(state => state.movieData.bannerData)

    const imageURL = useSelector(state => state.movieData.imageURL)
    console.log("image current url: ", imageURL)
    return (
        <div>
            <div>
                {imageURL && bannerData.map((data, index) => {
                    const imagePath = data.backdrop_path || data.poster_path;
                    if (!imagePath) {
                        return null;
                    }

                    const fullImageUrl = `${imageURL}${imagePath}`;

                    return (
                        <div key={index} className=' grid grid-cols-4' s>
                            <div className='flex flex-col gap-1'>
                                <img
                                    src={fullImageUrl}
                                    alt={data.name || data.title}

                                />
                                <h3>{data.title || data.name}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BannerHome
