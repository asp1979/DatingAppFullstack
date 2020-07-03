import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';

export const User = ({ match }) => {

    const getPathID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch("http://localhost:5000/api/v1/users/" + getPathID, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const data = await get.json();
                console.log(data);
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
                {
                    !loading &&
                    <div className="user-info">
                        <h1>{user.username}</h1>
                        <br></br>

                        <img src={user.photoUrl} alt=""></img>
                        <br></br>

                        <p>{user.gender}</p>
                        <br></br>

                        <p>{user.introduction}</p>
                        <br></br>

                        <p>{user.lookingFor}</p>
                        <br></br>

                        <p>{user.country}</p>
                        <br></br>
                        
                        <p>{user.city}</p>
                    </div>
                }
            </div>
        </div>
    )
}
