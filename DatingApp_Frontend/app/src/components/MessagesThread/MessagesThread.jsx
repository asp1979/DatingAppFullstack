import './MessagesThread.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';

export const MessagesThread = ({ match }) => {

    const { userContext } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMessages() {
            const client = userContext.jwtID;
            const sender = match.params.id;
            const get = await fetch(`http://localhost:5000/api/v1/users/${client}/messages/thread/${sender}`, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();
                setMessages([...res]);
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
                    !loading && messages 
                    .map((msg, i) => 
                        <p key={i}>{msg.content}</p>
                    )
                }
                </ul>
            </div>
        </div>
    )
}