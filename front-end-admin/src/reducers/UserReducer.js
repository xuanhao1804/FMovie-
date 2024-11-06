import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserService } from "../services/UserService";

const initialState = {
    user: {},
}

export const loginUser = createAsyncThunk("/user/loginUser", async (data) => {
    const response = await UserService.signInService(data)
    return response
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUserData: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = {}
        },
    }
})

export const { saveUserData, logout } = userSlice.actions

export default userSlice.reducer