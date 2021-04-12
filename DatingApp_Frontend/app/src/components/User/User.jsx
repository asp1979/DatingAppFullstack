import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { UserCard } from './UserCard';

export const User = ({ match, history }) => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const baseURL = userContext.baseURL;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };
    const canBeUnliked = (+userID) !== (+userContext.jwtID) ? true : false;

    const unlikeUser = async () => {
        const unlike = await fetch(baseURL + `v1/users/${userContext.jwtID}/like/${userID}`, {
            ...headers,
            method: "DELETE"
        });
        if(unlike.ok) {
            history.push("/matches"); // redirect
        }
    }
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch(baseURL + `v1/users/${userID}`, headers);
            if(get.ok) {
                const data = await get.json();
                setLoading(false);
                setUser({ ...data });
            }
        }
        getUser();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="page user">

            <div className="content">
                {
                    !loading &&
                    <UserCard user={user} unlikeUser={unlikeUser} canBeUnliked={canBeUnliked} />
                }
            </div>
            
        </div>
    )
}
