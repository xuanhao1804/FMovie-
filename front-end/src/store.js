import { configureStore, combineReducers } from "@reduxjs/toolkit"
import UserReducer from "./reducers/UserReducer"
import MovieReducer from "./reducers/MovieReducer"
import CityReducer from "./reducers/CityReducer"
import PopcornReducer from "./reducers/PopcornReducer"
import storage from 'redux-persist/lib/storage'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'


const rootReducer = combineReducers({
    user: UserReducer,
    movies: MovieReducer,
    city: CityReducer,
    popcorns: PopcornReducer
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    }),

    devTools: true
})

export const persistor = persistStore(store);
