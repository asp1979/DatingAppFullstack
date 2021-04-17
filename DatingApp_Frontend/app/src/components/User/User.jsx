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
    const isSelf = user.id === (+userContext.jwtID);

    const messageUser = () => {
        history.push("/thread/" + user.id); // redirect to thread
    }

    const unlikeUser = async () => {
        const unlike = await fetch(baseURL + `v1/users/${userContext.jwtID}/like/${userID}`, {
            ...headers,
            method: "DELETE"
        });
        if(unlike.ok) {
            history.push("/matches"); // redirect to matches
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
                { isSelf && <h2>Profile</h2> }
                {
                    !loading &&
                    <UserCard
                    user={user}
                    isSelf={isSelf}
                    canBeMessaged={!isSelf}
                    messageUser={messageUser}
                    canBeUnliked={!isSelf}
                    unlikeUser={unlikeUser}
                    />
                }
            </div>
            
        </div>
    )
}
