import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { UserCard } from './UserCard';
import { useTimderApi } from '../../hooks/useTimderApi';

export const User = ({ match, history }) => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);
    const { timderFetch } = useTimderApi();

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const isSelf = user.id === (+userContext.jwtID);

    const messageUser = () => {
        history.push("/thread/" + user.id); // redirect to thread
    }

    const unlikeUser = async () => {
        await timderFetch("DELETE", `v1/users/${userContext.jwtID}/like/${userID}`)
        .then(res => res.json())
        .then(res => {
            history.push("/matches"); // redirect to matches
        })
    }
    
    useEffect(() => {
        async function getUser() {
            await timderFetch("GET", `v1/users/${userID}`)
            .then(res => res.json())
            .then(res => {
                setLoading(false);
                setUser({ ...res });
            })
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
