"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa6';
import LoadingSpinner from '@/components/LoadingSpinner';
import VideoPlayer from '@/components/VideoPlayer';
import CastCard from '@/components/CastCard';

const VALID_MEDIA_TYPES = ['movie', 'tv'];
const PLACEHOLDER_POSTER = '/moviePlaceHolder.png';
const PLACEHOLDER_BACKDROP = '/images/backdrop-placeholder.png';

const DetailsPage = () => {

  const params = useParams();
  const mediaType = params.mediaType; // 'movie' or 'tv'
  const id = params.id;               // e.g., '12345'

  const imageBaseUrl = useSelector(state => state.movieData.imageURL);

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    console.log(`Fetching details for ${mediaType}/${id}...`);

    try {

      const response = await axios.get(`/${mediaType}/${id}`, {
        params: {
          append_to_response: 'credits,videos'
        }
      });

      console.log("API Response:", response.data); // Log response for debugging

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
    fetchData();
  }, [fetchData]);   // depend on fetchData

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
    episode_run_time // (array)
  } = details;

  const displayTitle = title || name || "Untitled";
  const displayDate = release_date || first_air_date;
  const displayRuntime = (runtime / 60).toFixed(1).split(".") || (episode_run_time && episode_run_time.length > 0 ? `${episode_run_time[0]}m per episode` : null);
  const displayRating = vote_average ? Number(vote_average).toFixed(1) : null;

  const backdropUrl = getImageUrl(backdrop_path, "original");
  const posterUrl = getImageUrl(poster_path, "w500");

  // Find official trailer 
  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')
    || videos.find(video => video.site === 'YouTube');


  return (
    <div className="pb-10 text-white">
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
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
                onError={(e) => handleImageError(e, PLACEHOLDER_POSTER)}
              />
            ) : (
              <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-400 text-sm">No Poster</div>
            )}
          </div>

          {/* Text Details */}
          <div className="flex-grow pt-4 md:pt-8 lg:pt-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{displayTitle}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400 mb-3">
              {displayDate && <span>Release Date: {new Date(displayDate).getFullYear()}</span>}
              {displayRuntime && <><span>•</span><span>Duration: {displayRuntime[0]}h {displayRuntime[1]}m </span></>}
              {displayRating && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    Rating: {displayRating}  <FaStar className='text-yellow-400' />
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4 mt-4">
              {genres?.map(genre => (
                <span key={genre.id} className="text-xs bg-neutral-700 px-2 py-1 rounded-full">{genre.name}</span>
              ))}
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">Overview</h3>
            <p className="text-neutral-300 leading-relaxed">
              {overview || "No overview available."}
            </p>
          </div>
        </div>
      </div>

      {/* Cast Section  */}
      {cast.length > 0 && (
        <div className="container mx-auto px-4 mt-10">
          <h3 className="text-2xl font-semibold mb-4">Cast</h3>
          <div className="flex items-start space-x-4 md:space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {cast.slice(0, 15).map(member => ( // Show top 15 cast
              <CastCard key={member.cast_id || member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Videos / Trailer Section  */}
      {trailer && (
        <div className="container mx-auto px-4 mt-10">
          <h3 className="text-2xl font-semibold mb-4">Trailer</h3>
          <VideoPlayer videoKey={trailer.key} />
        </div>
      )}

    </div>
  )
}


export default DetailsPage;
