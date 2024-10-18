import { configureStore } from "@reduxjs/toolkit"
import UserReducer from "./reducers/UserReducer"
import MovieReducer from "./reducers/MovieReducer"
import CityReducer from "./reducers/CityReducer"

export const store = configureStore({
    reducer: {
        user: UserReducer,
        movies: MovieReducer,
        city: CityReducer
    }
})