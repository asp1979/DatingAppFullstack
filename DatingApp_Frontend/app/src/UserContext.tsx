import { createContext } from 'react';
import { IUserContext } from './interfaces/Interfaces';

export const UserContext = createContext<IUserContext>({
    userContext: {
        baseURL: "",
        jwt: "",
        jwtID: "",
        jwtUsername: "",
        jwtPhotoUrl: "",
        jwtExpiry: -1,
        loggedIn: false,
        unreadMatches: 0
    },
    setUserContext: () => {}
});