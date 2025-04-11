"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import axios from 'axios';
import { setImageURL } from './movieSlice'; 
import { fetchInitialData } from './movieSlice';

// This component receives the rest of the app as children
// and performs initial setup actions that require Redux dispatch
export default function AppInitializer({ children }) {
  const dispatch = useDispatch(); // Called safely inside Provider context

  useEffect(() => {
    dispatch(fetchInitialData());
  },[dispatch]);
  

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/configuration");
        const secureBaseUrl = response.data?.images?.secure_base_url;

        if (secureBaseUrl) {
          dispatch(setImageURL(secureBaseUrl)); // Dispatch the action

        } else {
          console.error("AppInitializer: Invalid configuration response", response.data);
        }
      } catch (error) {
        console.error("AppInitializer: Failed to fetch TMDB configuration:", error);
      }
    };

    fetchConfig(); // Fetch configuration when initializer mounts
  }, [dispatch]); // Run once on mount

  // Render the actual application content passed as children
  return <>{children}</>;
}