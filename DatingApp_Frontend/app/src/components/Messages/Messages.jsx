import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { messageThreads } from './messageThreads';
import { useTimderApi } from '../../hooks/useTimderApi';

export const Messages = () => {

    const { userContext } = useContext(UserContext);
    const { timderFetch } = useTimderApi();
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Newest"); // already sorted by newest in response

    const userID = Number(userContext.jwtID);
    const path = `v1/users/${userID}/messages`;

    useEffect(() => {
        async function getMessages() {
            const inbox = await timderFetch("GET", path + "?messageContainer=inbox");
            const outbox = await timderFetch("GET", path + "?messageContainer=outbox");
            if(inbox.ok && outbox.ok) {
                const inboxJSON = await inbox.json();
                const outboxJSON = await outbox.json();
                const threads = messageThreads(inboxJSON, outboxJSON);
                setThreads([...threads]);
                setLoading(false);
            } else {
                console.error("failed inbox/outbox fetch", inbox, outbox)
            }
        }
        getMessages();
        // eslint-disable-next-line
    }, []);

    function sortThreadsState(sortBy) {
        if(sortBy === "Newest") {
            setThreads([...threads.sort((a,b) => Date.parse(b[1][0].messageSent) - Date.parse(a[1][0].messageSent))]);
            setSortBy("Newest");
        }
        else if(sortBy === "Oldest") {
            setThreads([...threads.sort((a,b) => Date.parse(a[1][0].messageSent) - Date.parse(b[1][0].messageSent))]);
            setSortBy("Oldest");
        }
        else if(sortBy === "Recieved") {
            setThreads([...threads.sort((a,b) => b[1].length - a[1].length)]);
            setSortBy("Recieved");
        }
        else if(sortBy === "Unread") {
            setThreads([...threads.sort((a,b) => b[4] - a[4])]);
            setSortBy("Unread");
        }
        else if(sortBy === "Username") {
            setThreads([...threads.sort((a,b) => a[2].localeCompare(b[2]))]);
            setSortBy("Username");
        }
    }

    return (
        <div className="page messages">
            <div className="content">
                <h1>Messages</h1>

                <div className="sortby">
                    <div className="sortby-btn">Sort by: {sortBy}</div>
                    <div className="sortby-content">
                        <li onClick={() => sortThreadsState("Newest")}>Newest</li>
                        <li onClick={() => sortThreadsState("Oldest")}>Oldest</li>
                        <li onClick={() => sortThreadsState("Recieved")}>Recieved</li>
                        <li onClick={() => sortThreadsState("Unread")}>Unread</li>
                        <li onClick={() => sortThreadsState("Username")}>Username</li>
                    </div>
                </div>

                {
                    !loading && threads.length === 0
                    ? <div className="empty-list">No messages yet.</div>
                    : null
                }

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
                            <p className="last-msg">{user[1][0].content.substring(0,16) + "..."}</p>
                            { user[4] > 0 ? <p className="unread-count">{user[4]}</p> : null }
                        </Link>
                    )
                }
                </ul>
            </div>
        </div>
    )
}
