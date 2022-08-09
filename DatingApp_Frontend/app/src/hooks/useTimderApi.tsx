import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { AnyJSON, HTTPVerb, IUserContext } from '../interfaces/Interfaces';

type TimderRequest = (path: string, postJSON?: AnyJSON) => Promise<any>

interface ITimderFetch {
    get: TimderRequest,
    post: TimderRequest,
    put: TimderRequest,
    delete: TimderRequest,
}

export const useTimderApi = (): ITimderFetch => {
    const { userContext } = useContext<IUserContext>(UserContext);

    const timderFetch = async (path: string, verb: HTTPVerb, postJSON?: AnyJSON) => {
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
            let json: AnyJSON;
            try {
                json = await res.json();
            } catch {
                json = "";
            }
            return json;
        })
    }

    const methods: ITimderFetch = {
        get: (path, postJSON) => timderFetch(path, "GET", postJSON),
        post: (path, postJSON) => timderFetch(path, "POST", postJSON),
        put: (path, postJSON) => timderFetch(path, "PUT", postJSON),
        delete: (path, postJSON) => timderFetch(path, "DELETE", postJSON)
    }

    return methods;
}
