import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserService } from "../services/UserService";

const initialState = {
    user: {},
    recoverEmail: "",
    canResetPassword: false,
    credential: "",
    clientId: "",
}

export const createUser = createAsyncThunk("/user/createUser", async (data) => {
    const response = await UserService.signUpService(data)
    return response
})

export const loginUser = createAsyncThunk("/user/loginUser", async (data) => {
    const response = await UserService.signInService(data)
    return response
})

export const resetPassword = createAsyncThunk("/user/resetPassword", async (data) => {
    const response = await UserService.resetPasswordService(data)
    return response
})

export const verifyOTP = createAsyncThunk("/user/verifyOTP", async (data) => {
    const response = await UserService.verifyOTPService(data)
    return response
})

export const sendEmail = createAsyncThunk("/user/sendEmail", async (data) => {
    const response = await UserService.sendEmailService(data)
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
        setRecoverEmail: (state, action) => {
            state.recoverEmail = action.payload
        },
        setCanResetPassword: (state, action) => {
            state.canResetPassword = action.payload
        },
        resetInfo: (state, action) => {
            state.user.account = action.payload
        },
        setCredential: (state, action) => {
            state.credential = action.payload
        },
        setClientId: (state, action) => {
            state.clientId = action.payload
        }
    }
})

export const { saveUserData, logout, setRecoverEmail, setCanResetPassword, resetInfo, setCredential, setClientId } = userSlice.actions

export default userSlice.reducer