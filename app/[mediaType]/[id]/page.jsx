"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, notFound, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { FaStar, FaPlay } from 'react-icons/fa6';
import LoadingSpinner from '@/components/LoadingSpinner';
import VideoPlay from '@/components/VideoPlay';
import VideoPlayer from '@/components/VideoPlayer';
import CastCard from '@/components/CastCard';
import HorizontalScroll from '@/components/HorizontalScroll';
import useFetch from '@/hooks/useFetch';


const VALID_MEDIA_TYPES = ['movie', 'tv'];
const PLACEHOLDER_POSTER = '/moviePlaceHolder.png';
const PLACEHOLDER_BACKDROP = '/images/backdrop-placeholder.png';

const getCrewByJob = (crewList, jobs) => {
  const crewByJob = {};
  if (!crewList) return crewByJob;

  jobs.forEach(job => {
    const members = crewList.filter(member => member.job === job);
    if (members.length > 0) {
      crewByJob[job] = members.map(m => m.name).join(', ');
    }
  });
  return crewByJob;
};

const DetailsPage = () => {

  const params = useParams();
  const mediaType = params.mediaType; // 'movie' or 'tv'
  const id = params.id;               // e.g., '12345'
  const searchParams = useSearchParams();

  const imageBaseUrl = useSelector(state => state.movieData.imageURL);

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);


  const { data: similarData } = useFetch(mediaType && id ? `/${mediaType}/${id}/similar` : null);
  const { data: recommendationData } = useFetch(mediaType && id ? `/${mediaType}/${id}/recommendations` : null);


  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    // Validate params before fetching
    if (!VALID_MEDIA_TYPES.includes(mediaType) || !id || !/^\d+$/.test(id)) {
      setError("Invalid media type or ID.");
      setLoading(false);

      notFound();
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await axios.get(`/${mediaType}/${id}`, {
        params: {
          append_to_response: 'credits,videos'
        }
      });

      setDetails(response.data);
      setCast(response.data.credits?.cast || []); // Get cast from appended credits
      setVideos(response.data.videos?.results || []); // Get videos from appended results

    } catch (err) {
      console.error(`Detail Page Error fetching ${mediaType}/${id}:`, err);
      const errorMsg = err.response?.data?.status_message || err.message || "Failed to load details.";
      setError(errorMsg);
      if (err.response?.status === 404) {
        notFound(); // Trigger Next.js 404 page if TMDB returns 404
      }
    } finally {
      setLoading(false);
    }
  }, [mediaType, id]); // Depend on mediaType and id

  useEffect(() => {
    if (mediaType && id) {
      fetchData();
    } else {
      setLoading(false);
      if (!VALID_MEDIA_TYPES.includes(mediaType) || !/^\d+$/.test(id)) {
        setError("Invalid media type or ID format in URL.");
      }
    }
  }, [fetchData, mediaType, id]);   // depend on fetchData

  // --- Render Helper Functions ---
  const getImageUrl = (path, size = "original") => {

    if (!imageBaseUrl || !path) return null; // Return null if no base or path

    return `${imageBaseUrl}${size}${path}`;
  };

  const handleImageError = (e, placeholder) => {
    if (e.target.src !== placeholder) {
      e.target.onerror = null;
      e.target.src = placeholder;
    }
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center pt-16'>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-16 px-4">
        <div className="text-center text-red-500 my-8 bg-red-100 border border-red-400 rounded p-6 max-w-md mx-auto">
          <p className='font-semibold text-xl mb-2'>Error Loading Page</p>
          <p>{error}</p>

        </div>
      </div>
    );
  }

  if (!details) {
    // Should be caught by error/loading, but as a fallback
    return <div className="min-h-screen pt-16 text-center">Details not found.</div>;
  }

  // --- Extract Data for Display ---
  const {
    title,
    name,
    overview,
    poster_path,
    backdrop_path,
    vote_average,
    release_date,
    first_air_date,
    genres,
    runtime,
    episode_run_time,
    credits
  } = details;

  const displayTitle = title || name || "Untitled";
  const displayDate = release_date || first_air_date;
  const calculateRuntime = () => {
    if (mediaType === 'movie' && runtime) {
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes}m`;
    } else if (mediaType === 'tv' && episode_run_time && episode_run_time.length > 0) {

      return `${episode_run_time[0]}m / ep`;
    }
    return null;
  };

  const displayRuntime = calculateRuntime();
  const displayRating = vote_average ? Number(vote_average).toFixed(1) : null;

  const backdropUrl = getImageUrl(backdrop_path, "original");
  const posterUrl = getImageUrl(poster_path, "w500");



  const jobsOfInterest = ['Director', 'Screenplay', 'Writer', 'Producer', 'Original Music Composer', 'Editor'];
  const crewInfo = credits?.crew ? getCrewByJob(credits.crew, jobsOfInterest) : {};


  // Find official trailer 
  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')
    || videos.find(video => video.site === 'YouTube');

  const openVideoModal = () => {
    // Optionally check if videos array is actually populated before opening
    if (videos && videos.length > 0) {
      setIsVideoModalOpen(true);
    } else {
      console.warn("No video data loaded yet or no videos available.");
      // You could show a small notification/toast here
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <div className="pb-10 text-white bg-neutral-900">
      {/* Backdrop Section */}
      <div className="relative w-full h-[30vh] sm:h-[50vh] lg:h-[70vh] -mt-16"> {/* Pull up behind header */}
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={`Backdrop for ${displayTitle}`}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority // Load backdrop quickly
            onError={(e) => handleImageError(e, PLACEHOLDER_BACKDROP)}
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500">No Backdrop</div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 relative z-10 -mt-16 md:-mt-24 lg:-mt-32">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Poster Image */}
          <div className="flex-shrink-0 w-[150px] h-[225px] md:w-[200px] md:h-[300px] lg:w-[250px] lg:h-[375px] relative rounded-lg overflow-hidden shadow-xl ">
            {posterUrl ? (

              <Image
                src={posterUrl}
                alt={`Poster for ${displayTitle}`}
                fill={true}
                priority
                sizes="(max-width: 768px) w-[150px], (max-width: 1024px) md:w-[200px], lg:w-[250px]"
                onError={(e) => handleImageError(e, PLACEHOLDER_POSTER)}
              />

            ) : (
              <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-400 text-sm">No Poster Available</div>

            )}
          </div>

          {/* Text Details */}
          <div className="flex-grow pt-4 md:pt-8 lg:pt-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{displayTitle}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400 mb-3">
              {displayDate && <span>Release Date: {new Date(displayDate).getFullYear()}</span>}
              {displayRuntime && <><span>•</span><span>Duration: {displayRuntime} </span></>}
              {displayRating && displayRating > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    Rating: {displayRating}  <FaStar className='text-yellow-400' />
                  </span>
                </>
              )}
            </div>

            {videos && videos.length > 0 && (
              <button
                onClick={openVideoModal}
                className="mt-3 mb-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 cursor-pointer"
              >
                <FaPlay className="w-4 h-4" />
                <span>Play Now</span>
              </button>

            )}


            <div className="flex flex-wrap gap-2 mb-4 mt-4">
              {genres?.map(genre => (
                <span key={genre.id} className="text-xs bg-neutral-700 px-2 py-1 rounded-full hover:bg-neutral-600 transition-colors cursor-default">
                  {genre.name}
                </span>
              ))}
            </div>
            <h3 className="text-xl text-purple-500 font-semibold mt-4 mb-2">Overview</h3>
            <p className="text-neutral-300 leading-relaxed">
              {overview || "No overview available."}
            </p>

            {/** Crew Section */}
            {Object.keys(crewInfo).length > 0 && (
              <div className='mt-6 pt-4 border-t border-neutral-700/50'>
                <h3 className='text-xl text-purple-500 font-semibold mb-3'>Crew</h3> 
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm'>
                  {Object.entries(crewInfo).map(([job, names]) => (
                    <div key={job} className='flex flex-col sm:flex-row sm:items-baseline'>
                      <span className='font-semibold text-purple-500 w-full sm:w-32 flex-shrink-0 mb-1 sm:mb-0'>
                        {job}:
                      </span>
                      <span className='text-neutral-400'>
                        {names}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Cast Section  */}
      {
        (() => {
          const visibleCast = cast
            .filter(member => member.profile_path)
            .slice(0, 20);

          return visibleCast.length > 0 && (
            <div className="container mx-auto px-4 mt-10">

              <h3 className="text-3xl text-purple-500 font-semibold mb-4 ml-6">Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 ">
                {visibleCast.map(member => ( 
                  <CastCard key={member.cast_id || member.id} member={member} />
                ))}
              </div>
            </div>
          )
        })
      ()}




      {/* Videos / Trailer Section  */}
      {trailer && (
        <div className="container mx-auto px-4 mt-10">
          <h3 className="text-3xl text-purple-500 font-semibold mb-4 ml-6">Trailer</h3>
          <VideoPlayer videoKey={trailer.key} />
        </div>
      )}

      {/**  Similar and Recommendations Section */}
      <div className='container text-purple-500 mx-auto px-4 mt-10 space-y-10'>
        {similarData && similarData.length > 0 && (

          <HorizontalScroll data={similarData} heading={"Similar " + (mediaType === 'tv' ? 'TV Shows' : 'Movies')} media_type={mediaType} />
        )}
        {
          recommendationData && recommendationData.length > 0 && (
            <HorizontalScroll data={recommendationData} heading={"Recommendations"} media_type={mediaType} />
          )}
      </div>

      {/** ---- Conditionally Render VideoPlay Modal ---- */}
      {isVideoModalOpen && (
        <VideoPlay
          close={closeVideoModal}
          id={id}
          media_type={mediaType}
        />

      )}

    </div>
  )
}


export default DetailsPage;
