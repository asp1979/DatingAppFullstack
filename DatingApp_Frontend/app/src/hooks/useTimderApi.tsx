import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { IUserContext } from '../interfaces/Interfaces';

interface ITimderFetch {
    timderFetch: (verb: string, path: string, postJSON?: object | [] | "" | number) => Promise<any>
}

export const useTimderApi = (): ITimderFetch => {
    const { userContext } = useContext<IUserContext>(UserContext);

    const timderFetch: ITimderFetch["timderFetch"] = async (verb, path, postJSON) => {
        return await fetch(userContext.baseURL + path, {
            method: verb,
            headers: {
                "Authorization": "Bearer " + userContext.jwt,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: postJSON ? JSON.stringify(postJSON) : null
        })
        .then(res => {
            if(!res.ok) throw Error("Error: " + res.status + " " + res.statusText);
            return res.json();
        })
        .catch((err) => err);
    }

    return { timderFetch }
}
