import './Matches.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

export const Matches = () => {

    const { userContext } = useContext(UserContext);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMatches() {
            const get = await fetch("http://localhost:5000/api/v1/users", {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();
                setMatches([...res]);
                setLoading(false);
            } else {
                console.log(get.status, "Error");
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page matches">
            <div className="content">
                <h1>Matches</h1>
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
