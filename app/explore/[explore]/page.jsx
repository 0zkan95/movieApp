"use client"
import React from 'react';
import { useCallback, useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useParams } from 'next/navigation'
import Cart from '@/components/Cart';
import LoadingSpinner from '@/components/LoadingSpinner';

const ExplorePage = () => {
  const params = useParams();
  const exploreType = params.explore;


  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false); //  => Add loading state
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null); // => Add error state


  const isInitialLoadDone = useRef(false);

  const fetchData = useCallback(async (pageNumToFetch) => {
    if (loading || (totalPageNo > 0 && pageNumToFetch > totalPageNo) || !exploreType) {
      return;
    }

    if (!exploreType) {
      console.log("Fetch skipped exploreType not ready.")
      return;
    }

    if (pageNumToFetch = 1) {
      setInitialLoading(true)
    }

    setLoading(true);
    setError(null);


    try {
      const response = await axios.get(`/discover/${params.explore}`, {
        params: {
          page: pageNo
        }
      });

      if (pageNumToFetch === 1) {
        setData(response.data.results || []);
      } else {
        setData((prev) => [...prev, ...(response.data.results || [])]);
      }
      setTotalPageNo(response.data.total_pages || 0)

    } catch (err) {
      console.log("Explore Page Error: ", err);
      setError(err.message || "Failed to fetch data")
    } finally {
      setLoading(false);
      setInitialLoading(false);
      if (pageNumToFetch === 1) {
        isInitialLoadDone.current === true;

        setTimeout(() => {
          isInitialLoadDone.current = true;
        }, 500);
      }
    }
  }, [exploreType, loading, totalPageNo]);


  useEffect(() => {

    if (exploreType) {

      setPageNo(1);
      setData([]); // Clear old data when type changes
      setTotalPageNo(0); // Reset total pages
      isInitialLoadDone.current === false;
      fetchData();
    }
  }, [exploreType]); // Trigger fetch when exploreType is available/changes



  // Fetch subsequent pages when pageNo increases (but not on initial mount with type)
  useEffect(() => {
    if (pageNo > 1 && exploreType) {
      fetchData(pageNo);
    }
  }, [pageNo, exploreType])

  const handleScroll = useCallback(() => {
    if (!isInitialLoadDone.current || loading || (totalPageNo > 0 && pageNo >= totalPageNo)) {
      return;
    }

    const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500;

    // Check if near bottom
    if (nearBottom) { // Trigger slightly before exact bottom

      setPageNo((prev) => prev + 1);
    }
  }, [loading, pageNo, totalPageNo]); // Include dependencies

  // Add/Remove scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // --- Cleanup Function ---
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // Re-attach listener if handleScroll changes (due to its dependencies)

  // ---- >  Render logic

  if (initialLoading && pageNo === 1) {
    return (
      <div className='min-h-[80vh] flex justify-center items-center'>
        <LoadingSpinner size="lg" />
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
