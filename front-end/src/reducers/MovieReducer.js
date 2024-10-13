import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MovieService } from "../services/MovieService";
const initialState = {
    playingMovies: [],
    upcomingMovies: []
}

export const fetchMovies = createAsyncThunk("fetchMovies", async () => {
    const response = await MovieService.fetchMoviesService()
    return response
})

export const movieSlice = createSlice({
    name: "movies",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.playingMovies = action.payload.data.filter(movie => movie.status === "playing")
                state.upcomingMovies = action.payload.data.filter(movie => movie.status === "upcoming")
            }
        })
    }
})

export default movieSlice.reducer