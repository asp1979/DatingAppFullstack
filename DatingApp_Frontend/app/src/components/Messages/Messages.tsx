import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { messageThreads } from './messageThreads';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUserContext } from '../../interfaces/Interfaces';

type SortBy = ("Newest" | "Oldest" | "Unread" | "Username A-Z" | "Username Z-A")

export const Messages = (): JSX.Element => {

    const { userContext } = useContext<IUserContext>(UserContext);
    const { timderFetch } = useTimderApi();
    const [threads, setThreads] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortBy>("Newest");

    const userID = Number(userContext.jwtID);
    const path = `v1/users/${userID}/messages`;

    function sortThreadsState(sortBy: SortBy) {
        if(sortBy === "Newest") {
            setThreads([...threads.sort((a: any, b: any) => Date.parse(b[1][0].messageSent) - Date.parse(a[1][0].messageSent))]);
            setSortBy("Newest");
        }
        else if(sortBy === "Oldest") {
            setThreads([...threads.sort((a: any, b: any) => Date.parse(a[1][0].messageSent) - Date.parse(b[1][0].messageSent))]);
            setSortBy("Oldest");
        }
        else if(sortBy === "Unread") {
            setThreads([...threads.sort((a: any, b: any) => b[4] - a[4])]);
            setSortBy("Unread");
        }
        else if(sortBy === "Username A-Z") {
            setThreads([...threads.sort((a: any, b: any) => a[2].localeCompare(b[2]))]);
            setSortBy("Username A-Z");
        }
        else if(sortBy === "Username Z-A") {
            setThreads([...threads.sort((a: any, b: any) => b[2].localeCompare(a[2]))]);
            setSortBy("Username A-Z");
        }
    }

    useEffect(() => {
        async function getMessages() {
            try {
                const inboxJSON = await timderFetch("GET", path + "?messageContainer=inbox");
                const outboxJSON = await timderFetch("GET", path + "?messageContainer=outbox");
                const threads =
                    messageThreads(inboxJSON, outboxJSON)
                    .sort((a: any, b: any) => (
                        Date.parse(b[1][0].messageSent) - Date.parse(a[1][0].messageSent)
                    ));
                setThreads([...threads]);
                setLoading(false);
            } catch(err) {
                console.error("failed inbox/outbox fetch", err);
            }
        }
        getMessages();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="page messages">
            <div className="content">
                <h1>Messages</h1>

                <div className="sortby">
                    <div className="sortby-btn">Sort by: {sortBy}</div>
                    <div className="sortby-content">
                        <li onClick={() => sortThreadsState("Newest")}>Newest</li>
                        <li onClick={() => sortThreadsState("Oldest")}>Oldest</li>
                        <li onClick={() => sortThreadsState("Unread")}>Unread</li>
                        <li onClick={() => sortThreadsState("Username A-Z")}>Username A-Z</li>
                        <li onClick={() => sortThreadsState("Username Z-A")}>Username Z-A</li>
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
                    .map((user: any, i: number) => {

                        // user[0] = senderID
                        // user[1] = all message objects
                        // user[2] = senderUsername
                        // user[3] = senderPhotoUrl
                        // user[4] = unread messages count

                        return (
                            <Link to={"thread/" + user[0]} className="thread-link" key={i}>
                                <img className="photo" src={user[3]} alt=""></img>
                                <p className="last-msg">
                                    {user[1][0].senderUsername === userContext.jwtUsername
                                        ? ("You: " + user[1][0].content).substring(0,16) + "..."
                                        : (user[1][0].senderUsername + ": " + user[1][0].content).substring(0,12) + "..."
                                    }
                                </p>
                                { user[4] > 0 ? <p className="unread-count">{user[4]}</p> : null }
                            </Link>
                        )
                    })
                }
                </ul>
            </div>
        </div>
    )
}
