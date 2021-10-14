import './Find.css';
import React, { useEffect, useState } from 'react';
import { shuffleUsers } from './shuffleUsers';
import { SwipeCard } from './SwipeCard';
import { useTimderApi } from '../../hooks/useTimderApi';
import SwipeSVG from './SwipeSVG.svg';

export const Find = () => {

    const { timderFetch } = useTimderApi();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [swipeCount, setSwipeCount] = useState(0);

    useEffect(() => {
        async function getUsers() {
            const getAll = await timderFetch("GET", "v1/users"); 
            const getLikees = await timderFetch("GET", "v1/users?likersOrLikees=likees"); 
            if(getAll.ok && getLikees.ok) {
                const getAllJSON = await getAll.json();
                const getLikeesJSON = await getLikees.json();

                const getLikeesStr = getLikeesJSON.map(user => JSON.stringify(user));
                const usersNotYetLiked = getAllJSON.filter(user => !getLikeesStr.includes(JSON.stringify(user)));

                setUsers([...shuffleUsers(usersNotYetLiked)]);
                setLoading(false);
            } else {
                console.error("error fetching users/likees", getAll, getLikees)
            }
        }
        getUsers();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="page find" data-testid="find-component">
            <div className="content">
                {
                    !loading && (users.length > 0) &&
                    <div className="find-container">

                        <img className="swipe-svg" src={SwipeSVG} alt=""/>

                        <i className="fas fa-heart"></i>
                        {
                            swipeCount === users.length
                            ? <div className="swiping-limit" onClick={() => window.location.reload()}>
                                <h3>Refresh!</h3>
                            </div>
                            : <ul>
                                {users.map((user, i) => <SwipeCard user={user} swipeCount={swipeCount} setSwipeCount={setSwipeCount} key={i}/>)}
                            </ul>
                        }
                        <i className="fas fa-arrow-right"></i>

                    </div>
                } 
            </div>
        </div>
    )
}
