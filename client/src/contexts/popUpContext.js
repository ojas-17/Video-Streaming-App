import { createContext, useContext } from "react";

const popUpContext = createContext()

export const usePopUpContext = () => {
    return useContext(popUpContext)
}

export const PopUpProvider = popUpContext.Provider