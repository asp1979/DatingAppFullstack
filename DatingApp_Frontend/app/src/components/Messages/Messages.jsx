import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';

export const Messages = () => {

    const { userContext } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMessages() {
            const get = await fetch(`http://localhost:5000/api/v1/users/${userContext.jwtID}/messages`, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();
                setMessages([...res]);
                setThreads([...new Set(res.map(x => x.senderUsername))]);
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
                    .map((thread, i) => 
                        <p key={i}>{thread}</p>
                    )
                }
                </ul>
            </div>
        </div>
    )
}