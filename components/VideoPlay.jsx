import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { IoClose } from 'react-icons/io5';
import LoadingSpinner from './LoadingSpinner';



const VideoPlay = ({ id, close, media_type }) => {

    const { data: videoData, isLoading, error } = useFetch(
        media_type && id ? `/${media_type}/${id}/videos` : null // Fetch only if props are valid
    );

    const [videoKey, setVideoKey] = useState(null);

    // ----> Effect to find the best video key once data loads
    useEffect(() => {


        if (videoData && videoData.length > 0) {
            // Prioritize Trailer -> Teaser -> Official -> Any YouTube Video

            const trailer = videoData.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const teaser = videoData.find(v => v.type === 'Teaser' && v.site === 'YouTube');
            const official = videoData.find(v => v.official === true && v.site === 'YouTube');
            const anyYouTube = videoData.find(v => v.site === 'YouTube');

            setVideoKey(trailer?.key || teaser?.key || official?.key || anyYouTube?.key || null);
        } else {
            setVideoKey(null); // No videos found
        }
    }, [videoData]); // Dependency: run when videoData changes

    // ----> Effect for Escape key 
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                close(); // Call the close function passed via props
            }
        };
        window.addEventListener('keydown', handleEsc);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [close]);

    // ----> Effect to prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Hide scrollbar
        return () => {
            document.body.style.overflow = ''; // Restore scrollbar on unmount
        };
    }, []); // Run only once on mount

    return (
        <section
            onClick={close}
            className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
            <div className='bg-black w-full max-w-screen-lg aspect-video rounded relative shadow-lg'>

                <button
                    onClick={close}
                    aria-label='Close video player'
                    className='absolute -top-7 -right-1 md:-top-5 md:-right-5 z-60 p-1 text-white hover:scale-115 hover:text-white transition-colors duration-200 cursor-pointer'
                >

                    <IoClose size={24} color='purple' />
                </button>

                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size="lg" spinnerColor="border-purple-500" />
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">
                        Error loading video data. Please try again later.
                    </div>
                )}

                {/* No Video Found State */}
                {!isLoading && !error && !videoKey && (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400 p-4 text-center">
                        No playable video found for this title.
                    </div>
                )}

                {/* Iframe Player - Render only when ready */}
                {!isLoading && !error && videoKey && (
                    <iframe
                        // Construct YouTube embed URL dynamically
                        src={`https://www.youtube.com/embed/${videoKey}`}
                        className='w-full h-full border-0'
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        title='Video player'
                    />
                )}

            </div>

        </section>
    )
}

export default VideoPlay
