import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

export const Messages = () => {

    const { userContext } = useContext(UserContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    const userID = userContext.jwtID.toString();
    const username = userContext.jwtUsername.toString();

    useEffect(() => {
        async function getMessages() {
            const get = await fetch(`http://localhost:5000/api/v1/users/${userID}/messages`, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();

                // since we are getting all of the user's messages
                // this figures out how many unique conversations exist
                for(let i = 0; i < res.length; i++) {
                    delete res[i].content;
                    delete res[i].dateRead;
                    delete res[i].id;
                    delete res[i].isRead;
                    delete res[i].messageSent;

                    if(res[i].senderUsername === username) {
                        delete res[i].senderID;
                        delete res[i].senderUsername;
                        delete res[i].senderPhotoUrl;
                    }
                    if(res[i].recipientUsername === username) {
                        delete res[i].recipientID;
                        delete res[i].recipientUsername;
                        delete res[i].recipientPhotoUrl;
                    }
                }
                const threads = [...new Set(res.map(x => JSON.stringify(x)))].map(x => JSON.parse(x))

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
                        <Link to={"thread/" + (msg.recipientID || msg.senderID)} className="thread-link" key={i}>
                            <p>{(msg.recipientUsername || msg.senderUsername)}</p>
                            <img src={(msg.recipientPhotoUrl || msg.senderPhotoUrl)} alt=""></img>
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}