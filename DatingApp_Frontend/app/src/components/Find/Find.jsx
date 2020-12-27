import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';

export const Find = () => {

    const { userContext } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [usersIndex, setUsersIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const baseURL = "http://localhost:5000/api/";
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    const nextUserIndex = (usersIndex, usersArr) => {
        if((usersIndex + 1) < (usersArr.length)) {
            setUsersIndex(usersIndex + 1)
        } else {
            
        }
    }

    useEffect(() => {
        async function getUsers() {
            const getAll = await fetch(baseURL + "v1/users", headers); 
            const getLikees = await fetch(baseURL + "v1/users?likersOrLikees=likees", headers); 
            if(getAll.ok && getLikees.ok) {
                const getAllJSON = await getAll.json();
                const getLikeesJSON = await getLikees.json();

                const usersNotYetLiked = getAllJSON.filter(user =>
                    getLikeesJSON.map(likee => JSON.stringify(likee))
                    .includes(JSON.stringify(user)) === false
                );

                setUsers([...usersNotYetLiked]);
                setLoading(false);
            }
        }
        getUsers();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="page find">
            <h1>Find</h1>
            {
                !loading &&
                <div className="">
                    { users[usersIndex].username }

                    <button onClick={() => nextUserIndex(usersIndex, users)}> Next </button>
                </div>
            } 
        </div>
    )
}