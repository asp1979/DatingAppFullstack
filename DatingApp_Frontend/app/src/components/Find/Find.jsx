import './Find.css';
// NOTE: some css inherited from User.css
import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';

export const Find = () => {

    const { userContext } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [usersIndex, setUsersIndex] = useState(0);
    const [swipingLimit, setSwipingLimit] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const baseURL = "http://localhost:5000/api/";
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    const nextUserIndex = () => {
        if((usersIndex + 1) < (users.length)) {
            setUsersIndex(usersIndex + 1)
        } else {
            setSwipingLimit(true);
        }
    }

    const likeUser = (userID) => {
        fetch(baseURL + `v1/users/${userContext.jwtID}/like/${userID}`, {
            ...headers,
            method: "POST"
        });
        nextUserIndex();
    }

    useEffect(() => {
        async function getUsers() {
            const getAll = await fetch(baseURL + "v1/users", headers); 
            const getLikees = await fetch(baseURL + "v1/users?likersOrLikees=likees", headers); 
            if(getAll.ok && getLikees.ok) {
                const getAllJSON = await getAll.json();
                const getLikeesJSON = await getLikees.json();

                const getLikeesStr = getLikeesJSON.map(user => JSON.stringify(user));
                const usersNotYetLiked = getAllJSON.filter(user => !getLikeesStr.includes(JSON.stringify(user)));

                function shuffleArray(array) {
                    // randomize array order using Durstenfeld shuffle algorithm
                    for(let i = array.length - 1; i > 0; i--) {
                        let j = Math.floor(Math.random() * (i + 1));
                        let temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                    }
                    return array;
                }

                setUsers([...shuffleArray(usersNotYetLiked)]);
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
                    !loading && (swipingLimit || users.length === 0) &&
                    <div className="swiping-limit">
                        <h3>You have {swipingLimit ? "swiped through" : "liked"} all available users...</h3>
                    </div>
                }
                {
                    !loading && (users.length > 0 && !swipingLimit) &&
                    <div className="user-info">
                        <h1>
                            {users[usersIndex].username}
                        </h1>

                        <div className="user-info-nav not-flex">
                            <a href={"/find"}>
                                Overview
                            </a>
                        </div>

                        <img src={users[usersIndex].photoUrl} alt=""/>

                        <div className="age-box">
                            {
                                users[usersIndex].gender === "female" 
                                ? <i className="fa fa-female" aria-hidden="true"></i>
                                : <i className="fa fa-male" aria-hidden="true"></i>
                            }
                            &nbsp;{users[usersIndex].age}
                        </div>

                        <p>
                            {users[usersIndex].introduction}
                        </p>

                        <div className="buttons-container">
                            <button className="like-button" onClick={() => likeUser(users[usersIndex].id)}>
                                <i className="fas fa-heart"></i>
                            </button>
                            <button className="next-button" onClick={() => nextUserIndex()}>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                } 
            </div>
        </div>
    )
}
