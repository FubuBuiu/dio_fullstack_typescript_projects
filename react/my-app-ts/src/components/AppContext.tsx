import React, { ReactNode, createContext, useEffect, useState } from "react";
import { IStorageData, getLocalStorageValue } from "../services/storage";

interface IAppContext {
    userId: string;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;

}

export const AppContext = createContext({} as IAppContext);
export function AppContextProvider({ children }: { children: ReactNode }) {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const { login }: IStorageData = getLocalStorageValue();
        if (login !== '') {
            setIsLoggedIn(true);
            setUserId(login);
        }
    }, [isLoggedIn]);

    return (
        <AppContext.Provider value={{ userId, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AppContext.Provider>
    )
} 