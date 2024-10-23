import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {}
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state = { ...action.payload }
        }
    }
})

export const { login } = userSlice.actions

export default userSlice.reducer