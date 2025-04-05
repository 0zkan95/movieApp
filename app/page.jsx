"use client"
import BannerHome from "@/components/BannerHome";
import { setBannerData, setImageURL } from "@/store/movieSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

axios.defaults.baseURL = "https://api.themoviedb.org/3/"
const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
if (accessToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
} else {
  console.warn("TMDB Access Token is missing.")
}


export default function Home() {
  const dispatch = useDispatch();

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('/trending/all/week')
      dispatch(setBannerData(response.data.results));

    } catch (error) {
      console.error("API Error: ", error)
    }
  }

  const fetchConfiguration = async() => {
    try{

      const response = await axios.get("/configuration");
      dispatch(setImageURL(response.data.images.secure_base_url+"original"))
        console.log('config data: ' , response)
    }catch(error) {

      console.log('configuration error: ', error)
    }
  }

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, [dispatch])     // adding dispatch to dependency array is a good practice
  return (
    <main className="text-5xl text-center mt-8 text-purple-700">
       <BannerHome />
    </main>
  );
}
