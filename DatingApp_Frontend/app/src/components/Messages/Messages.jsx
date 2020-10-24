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
                const threads = 
                    [...new Set(
                        res.map(msg => msg.senderID + " " + msg.recipientID + " " + msg.senderUsername + " " + msg.recipientUsername))
                    ]
                    .map(x => x.split(" ").filter(y => y !== userID && y !== username))

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
                        // msg[0] = userID
                        // msg[1] = username
                        <Link to={"thread/" + msg[0]} className="thread-link" key={i}>
                            <p>{msg[1]}</p>
                            {/* <img src={""} alt=""></img> */}
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}