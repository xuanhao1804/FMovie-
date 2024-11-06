import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCarousels = createAsyncThunk('carousels/fetchCarousels', async () => {
  const response = await axios.get('http://localhost:9999/carousel/get-all');
  return response.data;
});

const carouselSlice = createSlice({
  name: 'carousels',
  initialState: {
    carousels: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarousels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCarousels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.carousels = action.payload;
      })
      .addCase(fetchCarousels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default carouselSlice.reducer;
