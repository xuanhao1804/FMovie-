// src/reducers/AccountReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action để lấy danh sách tài khoản
export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
  const response = await axios.get('/api/accounts');
  if (!Array.isArray(response.data)) {
    throw new Error('API did not return an array');
  }
  return response.data;
});

// Action để cập nhật tài khoản
export const updateAccount = createAsyncThunk('accounts/updateAccount', async (account) => {
  const response = await axios.put(`/api/accounts/${account._id}`, account);
  return response.data;
});

// Action để xóa tài khoản
export const deleteAccount = createAsyncThunk('accounts/deleteAccount', async (accountId) => {
  await axios.delete(`/api/accounts/${accountId}`);
  return accountId;
});

// Tạo slice để quản lý trạng thái
const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [], // Đảm bảo initialState là một mảng trống
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(account => account._id === action.payload._id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(account => account._id !== action.payload);
      });
  },
});

export default accountSlice.reducer;
