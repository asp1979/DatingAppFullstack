import './Find.css';
// NOTE: some css inherited from User.css
import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { shuffleUsers } from './shuffleUsers';
import { Card } from './Card';

export const Find = () => {

    const { userContext } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const baseURL = userContext.baseURL;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    useEffect(() => {
        async function getUsers() {
            const getAll = await fetch(baseURL + "v1/users", headers); 
            const getLikees = await fetch(baseURL + "v1/users?likersOrLikees=likees", headers); 
            if(getAll.ok && getLikees.ok) {
                const getAllJSON = await getAll.json();
                const getLikeesJSON = await getLikees.json();

                const getLikeesStr = getLikeesJSON.map(user => JSON.stringify(user));
                const usersNotYetLiked = getAllJSON.filter(user => !getLikeesStr.includes(JSON.stringify(user)));

                setUsers([...shuffleUsers(usersNotYetLiked)]);
                setLoading(false);
            }
        }
        getUsers();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="page find">
            <div className="content">
                {
                    !loading && (users.length > 0) &&
                    <div className="find-container">
                        <ul>
                        {users.map((user, i) => <Card user={user} key={i}/>)}
                        </ul>
                    </div>
                } 
            </div>
        </div>
    )
}
