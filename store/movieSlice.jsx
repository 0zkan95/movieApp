import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchInitialData = createAsyncThunk(
    'movieData/fetchInitial',
    async (_, { rejectWithValue }) => {
        try {
            // Fetch config for imageBaseUrl AND banner data concurrently
            const configPromise = axios.get('/configuration'); // Your API proxy route
            const trendingPromise = axios.get('/trending/all/week'); // Your API proxy route

            const [configResponse, trendingResponse] = await Promise.all([
                configPromise,
                trendingPromise
            ]);

            // Basic validation
            if (!configResponse.data?.images?.secure_base_url) {
                throw new Error("Invalid configuration response");
            }
            if (!trendingResponse.data?.results) {
                throw new Error("Invalid trending response");
            }

            return {
                imageURL: configResponse.data.images.secure_base_url,
                bannerData: trendingResponse.data.results.slice(0, 10) // Example: Get top 10
            };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch initial data';
            console.error("fetchInitialData Error:", error);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    bannerData: [],
    imageURL: "",
    isMobileSearchVisible: false,
    loadingStatus: 'idle',
    error: null,
}

export const movieSlice = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        setBannerData: (state, action) => {
            state.bannerData = action.payload
        },
        setImageURL: (state, action) => {
            state.imageURL = action.payload
        },

        openMobileSearch: (state) => {
            state.isMobileSearchVisible = true;
        },
        closeMobileSearch: (state) => {
            state.isMobileSearchVisible = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInitialData.pending, (state) => {
                state.loadingStatus = 'pending';
                state.error = null;
            })
            .addCase(fetchInitialData.fulfilled, (state, action) => {
                state.loadingStatus = 'succeeded';
                state.imageURL = action.payload.imageURL;
                state.bannerData = action.payload.bannerData;
            })
            .addCase(fetchInitialData.rejected, (state, action) => {
                state.loadingStatus = 'failed';
                state.error = action.payload;
            });
    },

});

export const { setBannerData, setImageURL, openMobileSearch, closeMobileSearch } = movieSlice.actions

export default movieSlice.reducer;