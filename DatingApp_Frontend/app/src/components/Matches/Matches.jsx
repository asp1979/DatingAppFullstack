import './Matches.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';

export const Matches = () => {

    const { userContext } = useContext(UserContext);
    const [matches, setMatches] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMatches() {
            const get = await fetch("http://localhost:5000/api/v1/users", {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });

            if(get.ok) {
                const res = await get.json();
                setMatches(res);
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
                    .filter(x => x.username !== userContext.jwtUsername)
                    .map((match, i) => 
                        <li className="person-card" key={i}>
                            <p>{match.knownAs}</p>
                            <img src={match.photoUrl} alt=""></img>
                        </li>
                    )
                }
                </ul>
            </div>
        </div>
    )
}
