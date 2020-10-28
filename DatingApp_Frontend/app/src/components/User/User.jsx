import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import './User.css';

export const User = ({ match }) => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch("http://localhost:5000/api/v1/users/" + userID, {
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
                {
                    !loading &&
                    <div className="user-info">

                        <h1>{user.username}</h1>

                        <div className="user-nav-buttons">
                            <Link to={`/user/${userID}`} className="active">Overview</Link>
                            <Link to={`/thread/${userID}`}>Messages</Link> 
                        </div>

                        <img src={user.photoUrl} alt=""></img>
                        <p className="age-text">
                            {
                                user.gender === "female" 
                                ? <i className="fa fa-female" aria-hidden="true"></i>
                                : <i className="fa fa-male" aria-hidden="true"></i>
                            }
                            &nbsp;{user.age}
                        </p>
                        <p>{user.introduction}</p>

                    </div>
                }
            </div>
            
        </div>
    )
}
