import './MessagesThread.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';

export const MessagesThread = ({ match }) => {

    const { userContext } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [oppositeUser, setOppositeUser] = useState([]);
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

                res.sort((a,b) => Date.parse(a.messageSent) - Date.parse(b.messageSent));
                setMessages([...res]);

                const oppositeUser = res.filter(msg => msg.senderID !== Number(userContext.jwtID));
                setOppositeUser([...oppositeUser]);

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
            <div className="content with-h1-img">
                {
                    !loading
                    ? <h1>Messages<img className="title-img" src={oppositeUser[0].senderPhotoUrl} alt=""></img> </h1>
                    : <h1>Messages</h1>
                }
                <ul>
                {
                    !loading && messages
                    .map((msg, i) => 
                            msg.senderID === Number(userContext.jwtID)
                            ? <div key={i} className="message-container">
                                <p>{msg.content}</p>
                                <p>{msg.messageSent.substring(11,16)}</p>
                            </div>

                            : <div key={i} className="message-container recipient">
                                <p>{msg.content}</p>
                                <p>{msg.messageSent.substring(11,16)}</p>
                            </div>
                    )
                }
                </ul>
            </div>
        </div>
    )
}