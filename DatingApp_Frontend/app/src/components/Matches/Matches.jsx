import './Matches.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

export const Matches = () => {

    const { userContext, setUserContext } = useContext(UserContext);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Username"); // response is sorted by username

    useEffect(() => {
        async function getMatches() {
            const get = await fetch(userContext.baseURL + "v1/users?likersOrLikees=likees", {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();
                setMatches([...res.sort((a,b) => a.username.localeCompare(b.username))]);
                setLoading(false);
                setUserContext({
                    ...userContext,
                    unreadMatches: 0
                });
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, []);

    function sortMatchesState(sortBy) {
        if(sortBy === "Username") {
            setMatches([...matches.sort((a,b) => a.username.localeCompare(b.username))]);
            setSortBy("Username");
        }
        else if(sortBy === "Age Ascending") {
            setMatches([...matches.sort((a,b) => a.age - b.age)]);
            setSortBy("Age Ascending");
        }
        else if(sortBy === "Age Descending") {
            setMatches([...matches.sort((a,b) => b.age - a.age)]);
            setSortBy("Age Descending");
        }
        else if(sortBy === "Gender") {
            setMatches([...matches.sort((a,b) => a.gender.localeCompare(b.gender))]);
            setSortBy("Gender");
        }
    }

    return (
        <div className="page matches">
            <div className="content">
                <h1>Matches</h1>

                <div className="sortby">
                    <button className="sortby-btn">Sort by: {sortBy}</button>
                    <div className="sortby-content">
                        <p onClick={() => sortMatchesState("Username")}>Username</p>
                        <p onClick={() => sortMatchesState("Age Ascending")}>Age Ascending</p>
                        <p onClick={() => sortMatchesState("Age Descending")}>Age Descending</p>
                        <p onClick={() => sortMatchesState("Gender")}>Gender</p>
                    </div>
                </div>

                {
                    !loading && matches.length === 0
                    ? <div className="empty-list">No matches yet.</div>
                    : null
                }

                <ul>
                { 
                    !loading && matches
                    .filter(match => match.username !== userContext.jwtUsername)
                    .map((match, i) => 
                        <Link to={"user/" + match.id} className="person-card" key={i}>
                            <p>{match.username}</p>
                            <img src={match.photoUrl} alt=""></img>
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}