import { createContext } from 'react';
import { IUserContext } from './interfaces/Interfaces';

export const UserContext = createContext<IUserContext>({
    userContext: {
        baseURL: "",
        jwt: "",
        jwtID: "",
        jwtUsername: "",
        jwtExpiry: null,
        loggedIn: false,
        unreadMatches: 0
    },
    setUserContext: () => {}
});