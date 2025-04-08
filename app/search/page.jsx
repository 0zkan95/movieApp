"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner'; // Assuming these exist
import Cart from '@/components/Cart';                 // Assuming these exist

const SearchPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();

    // Get the 'q' query parameter from the URL
    const query = searchParams.get('q');

    // --- Corrected fetchData ---
    const fetchData = useCallback(async (searchTerm) => {
        // Prevent fetching if already loading or no search term provided
        if (loading || !searchTerm) {
            if (!searchTerm) setData([]); // Clear data if search term is removed
            return;
        }

        console.log(`Fetching data for query: ${searchTerm}`);
        setLoading(true);
        setError(null);
        setData([]); // Clear previous results for a new search

        try {
           
            const response = await axios.get(`/search/collection`, {
                params: {
                    query: searchTerm,
                    page: 1, // Fetch page 1 for now (pagination not implemented)
                }
            });

            setData(response.data.results || []); // Ensure results is an array

            if (!response.data.results || response.data.results.length === 0) {
                console.log("No results found from API for:", searchTerm);
            }

        } catch (err) {
            console.error("Search Page Error:", err);
            // Extract error message preferrably from backend response if available
            setError(err.response?.data?.message || err.message || "Failed to fetch data");
            setData([]); // Clear data on error
        } finally {
            setLoading(false);
        }

    }, [loading]); // Depend on loading state to potentially prevent overlapping requests via useCallback memoization


    useEffect(() => {
        const currentQuery = searchParams.get('q');

        if (currentQuery) {
            fetchData(currentQuery);
        } else {
            // If query is removed, clear results and error
            setData([]);
            setError(null); // Ensure error is null
            setLoading(false); // Ensure loading is false if query is cleared
        }
        
    }, [searchParams, fetchData]); // Depend on searchParams object and the fetchData callback


    return (
        <div className='container mx-auto px-4 pt-24 pb-10'>  
            <h1 className="text-3xl font-bold mb-2 text-neutral-100">Search Results</h1>
            {/* Conditional subtitle */}
            {query && (
                 <h2 className="text-xl font-semibold mb-6 text-neutral-300">
                     for "{query}"
                 </h2>
            )}


            {/* Loading indicator */}
            {loading && (
                <div className='flex justify-center my-8'>
                    <LoadingSpinner />
                </div>
            )}

            {/* Error Message */}
            {!loading && error && ( // Show error only when not loading
                <div className='text-center text-red-500 my-8 bg-red-100 border border-red-400 rounded p-4'>
                    <p className='font-semibold'>Error:</p>
                    <p>{error}</p>
                    {query && <p>Could not load results for "{query}". Please try again later.</p>}
                </div>
            )}

            {/* No Results Message */}
            {!loading && !error && query && data.length === 0 && (
                <p className="text-neutral-400 text-center my-8">No results found for "{query}".</p>
            )}

             {/* Prompt to Search Message */}
            {!loading && !error && !query && (
                <p className="text-neutral-400 text-center my-8">Please enter a search term in the header bar.</p>
            )}

            {/* Grid to display results */}
            {!loading && !error && data.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                    {data.map((item) => ( 
                        <Cart
                            
                            key={`${item.media_type || 'item'}-${item.id}`} // Ensure unique keys
                            data={item}
                            media_type={item.media_type} // Pass the media type to Cart if needed for links
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;