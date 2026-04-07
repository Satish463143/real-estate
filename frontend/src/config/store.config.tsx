import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { combineReducers } from '@reduxjs/toolkit'

import userReducer from '../reducer/user.reducer'
import { AuthApi } from '../../components/api/login.api'

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
})

export const persistor = persistStore(storeConfig)
export default storeConfig