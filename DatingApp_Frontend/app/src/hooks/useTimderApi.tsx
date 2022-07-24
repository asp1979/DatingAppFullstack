import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { AnyJSON, IUserContext } from '../interfaces/Interfaces';

interface ITimderFetch {
    timderFetch: (verb: string, path: string, postJSON?: AnyJSON) => Promise<any>
}

export const useTimderApi = (): ITimderFetch => {
    const { userContext } = useContext<IUserContext>(UserContext);

    const timderFetch: ITimderFetch["timderFetch"] = async (verb, path, postJSON) => {
        return fetch(userContext.baseURL + path, {
            method: verb,
            headers: {
                "Authorization": "Bearer " + userContext.jwt,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: postJSON ? JSON.stringify(postJSON) : null
        })
        .then(async (res) => {
            if(!res.ok) throw Error("Error: " + res.status + " " + res.statusText);
            let json: AnyJSON
            try {
                json = await res.json();
            } catch {
                json = "";
            }
            return json;
        })
    }

    return { timderFetch }
}
