"use client"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import storeConfig, { persistor } from '@/src/config/store.config'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={storeConfig}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
