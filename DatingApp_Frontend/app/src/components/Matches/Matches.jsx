import './Matches.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

export const Matches = () => {

    const { userContext, setUserContext } = useContext(UserContext);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Username");

    function sortMatchesState(sortBy) {
        if(sortBy === "Username") {
            setMatches([...matches.sort((a,b) => a.username.localeCompare(b.username))]);
            setSortBy("Username");
        }
        else if(sortBy === "Age") {
            setMatches([...matches.sort((a,b) => a.age - b.age)]);
            setSortBy("Age");
        }
        else if(sortBy === "Gender") {
            setMatches([...matches.sort((a,b) => a.gender.localeCompare(b.gender))]);
            setSortBy("Gender");
        }
    }

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

    return (
        <div className="page matches">
            <div className="content">
                <h1>Matches</h1>

                <div className="sortby">
                    <button className="sortby-btn">Sort by: {sortBy}</button>
                    <div className="sortby-content">
                        <p onClick={() => sortMatchesState("Username")}>Username</p>
                        <p onClick={() => sortMatchesState("Age")}>Age</p>
                        <p onClick={() => sortMatchesState("Gender")}>Gender</p>
                    </div>
                </div>

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