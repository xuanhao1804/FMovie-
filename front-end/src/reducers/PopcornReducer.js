import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PopcornService } from "../services/PopcornService";
const initialState = {
    list: []
}

export const fetchPopcorns = createAsyncThunk("fetchPopcorns", async () => {
    const response = await PopcornService.fetchPopcorn()
    return response
})

export const popcornSlice = createSlice({
    name: "popcorns",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchPopcorns.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.list = action.payload.data
            }
        })
    }
})

export default popcornSlice.reducer