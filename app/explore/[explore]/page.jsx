"use client"
import React from 'react';
import { useCallback, useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useParams, notFound } from 'next/navigation'
import Cart from '@/components/Cart';
import LoadingSpinner from '@/components/LoadingSpinner';

const VALID_EXPLORE_TYPES = ['movie', 'tv']

const ExplorePage = () => {
  const params = useParams();
  const exploreType = params.explore;


  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false); //  => Add loading state
  const [initialLoading, setInitialLoading] = useState(true);  // --- True before the first fetch completes
  const [error, setError] = useState(null); // => Add error state

  const isFetching = useRef(false); // -- Ref to prevent race conditions/multiple fetches
  const hasFetchedInitialPage = useRef(false); // -- Tracks if page 1 fetch is done for scroll handler

  // ---- exploreType validation
  useEffect(() => {
    if (exploreType && !VALID_EXPLORE_TYPES.includes(exploreType)) {
      notFound();
    }
  }, [exploreType]);

  const fetchData = useCallback(async (pageNumToFetch) => {
    if (isFetching.current || !exploreType || (totalPageNo > 0 && pageNumToFetch > totalPageNo)) {
      return;
    }


    console.log(` Attempting to fetch ${exploreType} page: ${pageNumToFetch} `);
    isFetching.current = true;
    setLoading(true);
    setError(null);

    if (pageNumToFetch === 1) {
      setInitialLoading(true)
      hasFetchedInitialPage.current = false;   // --- Reset scroll flag
    }

    try {
      const response = await axios.get(`/discover/${exploreType}`, {
        params: {
          page: pageNumToFetch
        }
      });

      const results = response.data.results || [];
      const totalPages = response.data.total_page || 0;

      if (pageNumToFetch === 1) {
        setData(results);
      } else {
        setData((prev) => [...prev, ...results]);   // ---> Append data for subsequent pages
      }
      setTotalPageNo(totalPageNo);

      if (pageNumToFetch === 1) {
        hasFetchedInitialPage.current = true;    /// ----> Mark initial fetch as done after success
      }
      console.log(` Successfully fetched page ${pageNumToFetch}. Total pages: ${totalPages} `);

    } catch (err) {

      console.error(`Explore Page Error fetching ${exploreType} page ${pageNumToFetch}:`, err);
      const errorMsg = err.response?.data?.message || err.message || ` Failed to fetch ${exploreType} data. `
      setError(errorMsg);

      if (pageNumToFetch === 1) {  // ----> reset data if page 1 fails fundamentally

        setData([]);
        setTotalPageNo(0);
      }

    } finally {

      setLoading(false);
      setInitialLoading(false);
      isFetching.current = false;

    }

  }, [exploreType, totalPageNo]);   //---> totalPageNo needed for the guard check


  useEffect(() => {

    if (exploreType && VALID_EXPLORE_TYPES.includes(exploreType)) {
      console.log(`Explore type changed to: ${exploreType}. Resetting and fetching page 1.`);

      setPageNo(1);
      setData([]); // Clear old data when type changes
      setTotalPageNo(0); // Reset total pages
      fetchData(1);
    } else if (exploreType) {
      setError(` Invalid explore type: ${exploreType} `);
      setData([]);
      setTotalPageNo(0);
      setInitialLoading(false)
    }
  }, [exploreType, fetchData]); // Trigger fetch 



  // Fetch subsequent pages when pageNo increases (but not on initial mount with type)
  useEffect(() => {
    if (pageNo > 1 && exploreType && VALID_EXPLORE_TYPES.includes(exploreType)) {
      fetchData(pageNo);
    }
  }, [pageNo, fetchData, exploreType])

  const handleScroll = useCallback(() => {
    if (!hasFetchedInitialPage.current || isFetching.current || (totalPageNo > 0 && pageNo >= totalPageNo)) {
      return;
    }

    const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500;

    // Check if near bottom
    if (nearBottom) { // Trigger slightly before exact bottom

      setPageNo((prevPageNo) => prevPageNo + 1);
    }
  }, [pageNo, totalPageNo]); // Include dependencies

  // Add/Remove scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // --- Cleanup Function ---
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // Re-attach listener if handleScroll changes (due to its dependencies)

  // ---- >  Render logic

  if (initialLoading && data.length === 1) {
    return (
      <div className='min-h-[80vh] flex justify-center items-center'>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Handle case where type is invalid after initial checks (belt and suspenders)

  if (!VALID_EXPLORE_TYPES.includes(exploreType)) {
    // Or render a specific "Invalid Category" component
    return <div className="pt-16 text-center text-purple-500 mt-20">Invalid explore category specified.</div>;
  }

  // Handle fundamental error loading initial data

  if (error && data.length === 0) {
    return (
      <div className="pt-16 text-center text-purple-500 my-20 border border-purple-400 rounded p-4 max-w-md mx-auto">
        <p className='font-semibold'>Error loading initial data:</p>
        <p className='my-4'>{error}</p>
      </div>
    )
  }



  return (
    <div className='py-16'>
      <div className='container mx-auto'>
        <h3 className='capitalize text-lg text-[#F17FFF] lg:text-xl font-semibold my-3'>
          Popular {exploreType} Shows
        </h3>

        {/* Grid to display results */}
        <div className='grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6'>
          {data.map((item, index) => (
            <Cart
              key={item.id + "-" + index} // Ensure unique keys
              data={item}
              media_type={exploreType} // Pass the media type to Cart if needed for links
            />
          ))}
        </div>

        {/* Loading indicator at the bottom */}
        {loading && (
          <div className='flex justify-center my-8'>
            <LoadingSpinner />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='text-center text-red-500 my-8'>
            Error: {error}
          </div>
        )}

        {/* Message when no more data */}
        {!loading && totalPageNo > 0 && pageNo >= totalPageNo && data.length > 0 && (
          <div className='text-center text-neutral-500 my-8'>
            You've reached the end!
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplorePage;
