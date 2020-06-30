import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';

export const User = ({ match }) => {

    const id = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch("http://localhost:5000/api/v1/users/" + id, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const data = await get.json();
                setLoading(false);
                setUser(data);
            } else {
                console.log(get.status, "Error");
            }
        }
        getUser();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="page user">
            <div className="content">
                {!loading && <h1>{user.username}</h1>}
                {!loading && <img src={user.photoUrl} alt=""></img>}
            </div>
        </div>
    )
}
