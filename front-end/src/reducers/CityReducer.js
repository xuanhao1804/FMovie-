import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CityService } from "../services/CityService";
const initialState = {
    list: []
}

export const fetchCities = createAsyncThunk("fetchCities", async () => {
    const response = await CityService.fetchCitiesService()
    return response
})

export const citySlice = createSlice({
    name: "city",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchCities.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.list = action.payload.data
            }
        })
    }
})

export default citySlice.reducer