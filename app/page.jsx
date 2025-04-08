"use client"
import BannerHome from "@/components/BannerHome";
import HorizontalScroll from "@/components/HorizontalScroll";
import useFetch from "@/hooks/useFetch";
import { setBannerData, setImageURL } from "@/store/movieSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



axios.defaults.baseURL = "/api"


export default function Home() {
  const dispatch = useDispatch();
  const { data: nowPlayingData } = useFetch('/movie/now_playing');
  const { data: topRatedData } = useFetch('/movie/top_rated');
  const { data: popularTvShowData } = useFetch('/tv/popular');
  const { data: onTheAirShowData } = useFetch('/tv/on_the_air');


  const fetchTrendingData = async () => {
    try {
      const response = await axios.get('/trending/all/week')
      dispatch(setBannerData(response.data.results));

    } catch (error) {
      console.error("API Error: ", error)
    }
  }

  const fetchConfiguration = async () => {
    try {

      const response = await axios.get("/configuration");
      dispatch(setImageURL(response.data.images.secure_base_url))
    } catch (error) {

      console.log('configuration error: ', error)
    }
  }

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();
  }, [dispatch])     // adding dispatch to dependency array is a good practice


  const trendingData = useSelector(state => state.movieData.bannerData)


  return (
    <main className="text-5xl text-center text-purple-700">
      <BannerHome />
      <HorizontalScroll data={trendingData} heading={"Trending Theaters"} trending={true} />
      <HorizontalScroll data={nowPlayingData} heading={"Now Playing"} media_type={"movie"} />
      <HorizontalScroll data={topRatedData} heading={"Top Rated Movies"} media_type={"movie"} />
      <HorizontalScroll data={popularTvShowData} heading={"Popular Tv Shows"} media_type={"tv"} />
      <HorizontalScroll data={onTheAirShowData} heading={"On The Air"} media_type={"tv"} />
    </main>
  );
}
