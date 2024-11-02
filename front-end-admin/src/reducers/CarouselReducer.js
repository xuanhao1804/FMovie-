// src/reducers/CarouselReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk để lấy dữ liệu carousel từ server
export const fetchCarousels = createAsyncThunk('carousels/fetchCarousels', async () => {
  const response = await axios.get('http://localhost:9999/carousel/get-all');
  return response.data;
});

// Thunk để thêm một carousel mới vào server
export const addCarousel = createAsyncThunk('carousels/addCarousel', async (carousel) => {
  const response = await axios.post('http://localhost:9999/carousel/create', carousel);
  return response.data;
});

// Thunk để cập nhật một carousel hiện có trên server
export const updateCarousel = createAsyncThunk('carousels/updateCarousel', async ({ id, carousel }) => {
  const response = await axios.put(`http://localhost:9999/carousel/update/${id}`, carousel);
  return response.data;
});

// Thunk để xóa một carousel khỏi server
export const deleteCarousel = createAsyncThunk('carousels/deleteCarousel', async (id) => {
  await axios.delete(`http://localhost:9999/carousel/delete/${id}`);
  return id;
});

// Tạo slice cho carousel
const carouselSlice = createSlice({
  name: 'carousels',
  initialState: {
    carousels: [],
    status: 'idle', // trạng thái có thể là 'idle', 'loading', 'succeeded', hoặc 'failed'
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
      })
      .addCase(addCarousel.fulfilled, (state, action) => {
        state.carousels.push(action.payload);
      })
      .addCase(updateCarousel.fulfilled, (state, action) => {
        const index = state.carousels.findIndex(carousel => carousel._id === action.payload._id);
        if (index !== -1) {
          state.carousels[index] = action.payload;
        }
      })
      .addCase(deleteCarousel.fulfilled, (state, action) => {
        state.carousels = state.carousels.filter(carousel => carousel._id !== action.payload);
      });
  },
});

// Export reducer mặc định
export default carouselSlice.reducer;
