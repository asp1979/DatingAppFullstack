import { useContext } from 'react';
import { UserContext } from '../UserContext';

export const useTimderApi = () => {
    const { userContext } = useContext(UserContext);

    const timderFetch = async (verb, path, postJSON) => {
        return await fetch(userContext.baseURL + path, {
            method: verb,
            headers: {
                "Authorization": "Bearer " + userContext.jwt,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postJSON)
        })
    }

    return { timderFetch }
}
