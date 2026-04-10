import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { combineReducers } from '@reduxjs/toolkit'

import userReducer from '../reducer/user.reducer'
import { AuthApi } from '../../components/api/login.api'
import { InquiryApi } from '../../components/api/inquiry.api'
import { UserApi } from '../../components/api/user.api'
import { PropertiesApi } from '../../components/api/properties.api'
import { AgentApi } from '../../components/api/agent.api'
import { BlogApi } from '../../components/api/blog.api'
import { FavouriteApi } from '../../components/api/favourite.api'
import { TestimonialApi } from '../../components/api/testimonal.api'

// Create a noop storage for SSR
const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: any) {
            return Promise.resolve(value)
        },
        removeItem(_key: string) {
            return Promise.resolve()
        },
    }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // Only persist user state
}

// Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [InquiryApi.reducerPath]: InquiryApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [PropertiesApi.reducerPath]: PropertiesApi.reducer,
    [AgentApi.reducerPath]: AgentApi.reducer,
    [BlogApi.reducerPath]: BlogApi.reducer,
    [FavouriteApi.reducerPath]: FavouriteApi.reducer,
    [TestimonialApi.reducerPath]: TestimonialApi.reducer,
    
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

const storeConfig = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        })
            .concat(AuthApi.middleware)
            .concat(InquiryApi.middleware)
            .concat(UserApi.middleware)
            .concat(PropertiesApi.middleware)
            .concat(AgentApi.middleware)
            .concat(BlogApi.middleware)
            .concat(FavouriteApi.middleware)
            .concat(TestimonialApi.middleware)           
            
})

export const persistor = persistStore(storeConfig)
export default storeConfig