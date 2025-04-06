import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaStar } from "react-icons/fa6";


const Cart = ({ data, trending, index }) => {

    const imageURL = useSelector(state => state.movieData.imageURL)



    return (
        <div className='w-full min-w-[230px] max-w-[230px] rounded h-80 overflow-hidden relative'>
            <img src={imageURL + data?.poster_path} alt={data?.title || data?.name} />

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

            <div className='absolute bottom-0 h-12 backdrop-blur-2xl w-full bg-gray/60'>
                <h2 className='text-ellipsis line-clamp-1 text-lg font-semibold text-left pl-2'>
                    {data?.title || data?.name}
                </h2>
                <div className='flex justify-between'>
                    <p className='text-sm text-left pl-3 text-neutral-400'>
                        {moment(data.release_date).format("MMM Do YY")}
                    </p>
                    <p className='text-sm mr-2 text-white flex'>
                        <FaStar className='mr-2' />
                        {Number(data.vote_average).toFixed(1)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Cart
