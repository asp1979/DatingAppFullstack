import './Matches.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUser, IUserContext } from '../../interfaces/Interfaces';

type SortBy = ("Username A-Z" | "Username Z-A" | "Age Ascending" | "Age Descending" | "Gender")

export const Matches = (): JSX.Element => {

    const { timderFetch } = useTimderApi();
    const { userContext, setUserContext } = useContext<IUserContext>(UserContext);
    const [matches, setMatches] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortBy>("Username A-Z");

    function sortMatchesState(sortBy: SortBy) {
        if(sortBy === "Username A-Z") {
            setMatches([...matches.sort((a,b) => a.username.localeCompare(b.username))]);
            setSortBy("Username A-Z");
        }
        else if(sortBy === "Username Z-A") {
            setMatches([...matches.sort((a,b) => b.username.localeCompare(a.username))]);
            setSortBy("Username Z-A");
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

    useEffect(() => {
        async function getMatches() {
            await timderFetch("GET", "v1/users?likersOrLikees=likees")
            .then(res => {
                setMatches([...res].sort((a,b) => a.username.localeCompare(b.username)));
                setLoading(false);
                setUserContext({
                    ...userContext,
                    unreadMatches: 0
                });
            })
            .catch(err => console.error(err))
        }
        getMatches();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page matches">
            <div className="content">
                <h1>Matches</h1>

                <div className="sortby">
                    <div className="sortby-btn">Sort by: {sortBy}</div>
                    <div className="sortby-content">
                        <li onClick={() => sortMatchesState("Username A-Z")}>Username A-Z</li>
                        <li onClick={() => sortMatchesState("Username Z-A")}>Username Z-A</li>
                        <li onClick={() => sortMatchesState("Age Ascending")}>Age Ascending</li>
                        <li onClick={() => sortMatchesState("Age Descending")}>Age Descending</li>
                        <li onClick={() => sortMatchesState("Gender")}>Gender</li>
                    </div>
                </div>

                {
                    !loading && matches.length === 0
                    ? <div className="empty-list">No matches yet.</div>
                    : <ul>
                        {matches
                            .filter(match => match.username !== userContext.jwtUsername)
                            .map((match, i) =>
                                <Link to={"user/" + match.id} className="person-card" key={i}>
                                    <p>{match.username}</p>
                                    <img src={match.photoUrl} alt=""></img>
                                </Link>
                            )
                        }
                    </ul>
                }

            </div>
        </div>
    )
}