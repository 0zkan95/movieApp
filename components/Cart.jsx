import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaStar } from "react-icons/fa6";
import Link from 'next/link';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/logo.png'


const Cart = ({ data, trending, index, media_type }) => {

    const imageURL = useSelector(state => state.movieData.imageURL)

    if (!data || !data.id) {
        console.log("Cart component received invalid data: ", data);
        return null;
    };

    const {
        id,
        poster_path,
        title,
        name,
        release_date,
        vote_average,
        media_type: dataMediaType
    } = data;

    // -- Determine the definitive media type
    const finalMediaType = dataMediaType ?? media_type; // Use data's type first, fallback to prop

    // -- Prepare display values with fallbacks
    const displayName = title || name || null;
    const displayDate = release_date ? moment(release_date).format("MMM Do YY") : "";
    const displayRating = vote_average ? Number(vote_average).toFixed(1) : null; // Keep as number or null for conditional rendering

    // -- Construct the full image URL (adding size here is flexible)
    const posterSize = "w500"; // Choose an appropriate size 
    const fullImageUrl = imageURL && poster_path
        ? `${imageURL}${posterSize}${poster_path}`
        : PLACEHOLDER_IMAGE;

    // -- Construct the detail page link URL
    const detailUrl = finalMediaType ? `/${finalMediaType}/${id}` : '#'; // Fallback link if mediaType is unknown

    // -- Handle image loading errors
    const handleImageError = (e) => {
        // Prevent infinite loop if placeholder also fails
        if (e.target.src !== PLACEHOLDER_IMAGE) {
            e.target.onerror = null; // Remove the handler
            e.target.src = PLACEHOLDER_IMAGE; // Set to placeholder
        }
    };

    return (
        <Link
            href={detailUrl}
            className='block group shadow-md w-full min-w-[230px] max-w-[230px] rounded h-80 overflow-hidden relative hover:scale-105 transition-all'>
            {/* Image Container */}
            <div className="relative w-full h-full">
                <Image // Use Next.js Image component
                    src={fullImageUrl}
                    alt={displayName} // Use display name for alt text
                    fill // Use fill to cover the container
                    style={{ objectFit: 'cover' }} // Cover ensures the image fills aspect ratio
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 230px" // Provide sizes for optimization
                    onError={handleImageError} // Handle loading errors
                    unoptimized={imageURL ? false : true} // Don't optimize placeholder URLs if they are local
                />
            </div>
            

            <div className='absolute top-2'>
                {
                    trending && (
                        <div className='py-1 px-2 backdrop-blur-3xl rounded-r-full bg-black/50 overflow-hidden'>
                            <p className='text-sm text-white'>
                                #{index} Trending
                            </p>
                        </div>
                    )
                }
            </div>

            {/* Info Overlay at Bottom */}

            <div className='absolute bottom-0 left-0 right-0 h-16 p-2 backdrop-blur-md bg-gradient-to-t from-black/80 via-black/60 to-transparent'>
                {/* Added gradient */}
                <h2 className='text-ellipsis line-clamp-1 text-base font-bold text-purple-500'>
                    {displayName}
                </h2>
                <div className='flex justify-between items-center mt-1'>
                    <p className='text-xs text-neutral-300'>
                        {displayDate}
                    </p>
                    {/* Conditionally render rating only if it exists */}
                    {displayRating !== null && (
                        <p className='text-xs font-semibold text-white flex items-center'>
                            <FaStar className='mr-1 text-yellow-400' /> 
                            {displayRating}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default Cart
