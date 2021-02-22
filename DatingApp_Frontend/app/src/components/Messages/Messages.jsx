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
    const baseURL = userContext.baseURL + `v1/users/${userID}/messages`;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    useEffect(() => {
        async function getMessages() {
            const inbox = await fetch(baseURL + "?messageContainer=inbox", headers);
            const outbox = await fetch(baseURL + "?messageContainer=outbox", headers);
            if(inbox.ok && outbox.ok) {
                const inboxJSON = await inbox.json();
                const outboxJSON = await outbox.json();
                const threads = createMessageThreads(inboxJSON, outboxJSON);
                setThreads([...threads]);
                setLoading(false);
            } 
        }
        getMessages();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page messages">
            <div className="content">
                <h1>Messages</h1>
                <div className="sort-by">Sort by </div>
                <ul>
                {
                    !loading && threads
                    .map((user, i) => 
                        // user[0] = senderID 
                        // user[1] = all message objects
                        // user[2] = senderUsername 
                        // user[3] = senderPhotoUrl
                        // user[4] = unread messages count 
                        <Link to={"thread/" + user[0]} className="thread-link" key={i}>
                            <img className="photo" src={user[3]} alt=""></img>
                            <p className="username">{user[2]}</p>
                            { user[4] > 0 ? <p className="unread-count">{user[4]}</p> : null }
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}
