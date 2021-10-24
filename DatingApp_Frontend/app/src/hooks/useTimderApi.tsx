import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { IUserContext } from '../interfaces/Interfaces';

interface ITimderFetch {
    timderFetch: (verb: string, path: string, postJSON: object | [] | "") => Promise<Response>
}

export const useTimderApi = (): ITimderFetch => {
    const { userContext } = useContext<IUserContext>(UserContext);

    const timderFetch: ITimderFetch["timderFetch"] = async (verb: string, path: string, postJSON: object | [] | "") => {
        return await fetch(userContext.baseURL + path, {
            method: verb,
            headers: {
                "Authorization": "Bearer " + userContext.jwt,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: postJSON ? JSON.stringify(postJSON) : null
        })
    }

    return { timderFetch }
}
