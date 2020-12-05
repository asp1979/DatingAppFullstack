import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { createMessageThreads } from './messagesAlgorithms';

export const Messages = () => {

    const { userContext } = useContext(UserContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const userID = Number(userContext.jwtID);

    useEffect(() => {
        async function getMessages() {
            const get = await fetch(`http://localhost:5000/api/v1/users/${userID}/messages`, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();
                const threads = createMessageThreads(res, userID);
                setThreads([...threads]);
                setLoading(false);
            } else {
                console.log(get.status, "Error");
            }
        }
        getMessages();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page messages">
            <div className="content">
                <h1>Messages</h1>
                <ul>
                {
                    !loading && threads
                    .map((msg, i) => 
                        <Link to={"thread/" + msg.userID} className="thread-link" key={i}>
                            <p>{msg.username}</p>
                            <img src={msg.photoUrl} alt=""></img>
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}