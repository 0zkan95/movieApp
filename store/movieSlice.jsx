import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    bannerData: [],
    imageURL: "",
    isMobileSearchVisible: false,
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
    }

})

export const { setBannerData, setImageURL, openMobileSearch, closeMobileSearch } = movieSlice.actions

export default movieSlice.reducer;