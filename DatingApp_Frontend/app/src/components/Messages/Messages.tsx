import './Messages.css';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { IPersonYouTalkedTo, messageThreads } from './messageThreads';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUserContext } from '../../interfaces/Interfaces';

type SortBy = ("Newest" | "Oldest" | "Unread" | "Username A-Z" | "Username Z-A")

export const Messages = (): JSX.Element => {

    const { userContext } = useContext<IUserContext>(UserContext);
    const { get } = useTimderApi();
    const [threads, setThreads] = useState<IPersonYouTalkedTo[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortBy>("Newest");

    const userID = Number(userContext.jwtID);
    const path = `v1/users/${userID}/messages`;

    function sortThreadsState(sortBy: SortBy) {
        if(sortBy === "Newest") {
            setThreads([...threads.sort((a: IPersonYouTalkedTo, b: IPersonYouTalkedTo) => {
                return Date.parse(b.sharedMessages[0].messageSent) - Date.parse(a.sharedMessages[0].messageSent);
            })]);
            setSortBy("Newest");
        }
        else if(sortBy === "Oldest") {
            setThreads([...threads.sort((a: IPersonYouTalkedTo, b: IPersonYouTalkedTo) => {
                return Date.parse(a.sharedMessages[0].messageSent) - Date.parse(b.sharedMessages[0].messageSent);
            })]);
            setSortBy("Oldest");
        }
        else if(sortBy === "Unread") {
            setThreads([...threads.sort((a: IPersonYouTalkedTo, b: IPersonYouTalkedTo) => {
                return a.unreadCount - b.unreadCount;
            })]);
            setSortBy("Unread");
        }
        else if(sortBy === "Username A-Z") {
            setThreads([...threads.sort((a: IPersonYouTalkedTo, b: IPersonYouTalkedTo) => {
                return a.username.localeCompare(b.username);
            })]);
            setSortBy("Username A-Z");
        }
        else if(sortBy === "Username Z-A") {
            setThreads([...threads.sort((a: IPersonYouTalkedTo, b: IPersonYouTalkedTo) => {
                return b.username.localeCompare(a.username);
            })]);
            setSortBy("Username Z-A");
        }
    }

    useEffect(() => {
        async function getMessages() {
            try {
                const inboxJSON = await get(path + "?messageContainer=inbox");
                const outboxJSON = await get(path + "?messageContainer=outbox");
                setThreads([...messageThreads(inboxJSON, outboxJSON, userID)]);
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
                    : <ul>
                        {threads
                            .map((user: IPersonYouTalkedTo, i: number) =>
                                <Link to={"thread/" + user.id} className="thread-link" key={i}>
                                    <img className="photo" src={user.photoUrl} alt=""></img>
                                    <p className="last-msg">
                                        { user.sharedMessages[0].senderID === userID
                                            ? ("You: " + user.sharedMessages[0].content).substring(0,16) + "..."
                                            : (user.sharedMessages[0].senderUsername + ": " + user.sharedMessages[0].content).substring(0,16) + "..."
                                        }
                                    </p>
                                    { user.unreadCount > 0 && <p className="unread-count">{user.unreadCount}</p> }
                                </Link>
                            )
                        }
                    </ul>
                }

            </div>
        </div>
    )
}
