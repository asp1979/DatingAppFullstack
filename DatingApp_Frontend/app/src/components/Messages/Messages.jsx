import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { messageThreads } from './messageThreads';

export const Messages = () => {

    const { userContext } = useContext(UserContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Newest"); // already sorted by newest in response

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
                const threads = messageThreads(inboxJSON, outboxJSON);
                setThreads([...threads]);
                setLoading(false);
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
                    <button className="sortby-btn">Sort by: {sortBy}</button>
                    <div className="sortby-content">
                        <p onClick={() => sortThreadsState("Newest")}>Newest</p>
                        <p onClick={() => sortThreadsState("Oldest")}>Oldest</p>
                        <p onClick={() => sortThreadsState("Recieved")}>Recieved</p>
                        <p onClick={() => sortThreadsState("Unread")}>Unread</p>
                        <p onClick={() => sortThreadsState("Username")}>Username</p>
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
