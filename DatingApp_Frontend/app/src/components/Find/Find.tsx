import './Find.css';
import React, { useEffect, useState } from 'react';
import { shuffleUsers } from './shuffleUsers';
import { SwipeCard } from './SwipeCard';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUser } from '../../interfaces/Interfaces';
import SwipeSVG from './SwipeSVG.svg';

export const Find = (): JSX.Element => {

    const { timderFetch } = useTimderApi();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [swipeCount, setSwipeCount] = useState(0);

    useEffect(() => {
        async function getUsers() {
            try {
                const getAllJSON = await timderFetch("GET", "v1/users");
                const getLikeesJSON = await timderFetch("GET", "v1/users?likersOrLikees=likees");

                const getLikeesStr = getLikeesJSON.map((user: IUser) => JSON.stringify(user));
                const usersNotYetLiked = getAllJSON.filter((user: IUser) => !getLikeesStr.includes(JSON.stringify(user)));

                setUsers([...shuffleUsers(usersNotYetLiked)]);
                setLoading(false);
            } catch(err) {
                console.error("error fetching users/likees", err);
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
                                <h3>No more users! Refresh.</h3>
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
