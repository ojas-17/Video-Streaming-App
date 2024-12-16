import { createContext, useContext } from 'react'

const loadingContext = createContext()

export const useLoadingContext = () => {
    return useContext(loadingContext)
}

export const LoadingProvider = loadingContext.Provider