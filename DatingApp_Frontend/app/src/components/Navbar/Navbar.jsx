import './Navbar.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { withRouter } from 'react-router-dom';

export const Navbar = withRouter(({ history }) => {

    const { userContext, setUserContext } = useContext(UserContext);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(true);
    const baseURL = "http://localhost:5000/api";
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    const logout = () => { 
        setUserContext({
            ...userContext,
            jwt: null,
            jwtID: null,
            jwtUsername: null,
            jwtExpiry: null,
            loggedIn: false,
        });
        localStorage.removeItem("jwt");
        history.push("/")
    }

    const reload = () => {
        setTimeout(() => window.location.reload(), 10);
    }

    useEffect(() => {
        if(userContext.loggedIn === true) {
            async function getUnreadMessagesCount() {
                const messages = await fetch(baseURL + `/v1/users/${userContext.jwtID}/messages`, headers) 
                if(messages.ok) {
                    const messagesJSON = await messages.json();
                    console.log(messagesJSON)
                    const unreadCount = messagesJSON.reduce((a,msg) => msg.isRead ? a + 0 : a + 1, 0);
                    console.log(unreadCount)
                    setUnread(unreadCount);
                    setLoading(false);
                }
            }
            getUnreadMessagesCount();
        }
        //eslint-disable-next-line
    }, [])

    return (
        <div className="navbar">
            
            <div className="route-nav">
                <Link to="/">
                    <h1>Timder</h1>
                </Link>
                { userContext.loggedIn && <Link to="/matches">
                    <p>Matches</p>
                </Link> }
                { userContext.loggedIn && <Link to="/messages">
                    <p>Messages {!loading && unread > 0 && <span className="unread-count">{unread}</span>}</p>
                </Link> }
            </div>

            <div className="user-nav">
                { !userContext.loggedIn && <Link to="/register"> Register </Link> }
                { !userContext.loggedIn && <Link to="/login"> Login </Link> }
                { userContext.loggedIn && <Link to={"/user/" + userContext.jwtID} onClick={ reload }> { userContext.jwtUsername } </Link> }
                { userContext.loggedIn && <button onClick={ logout }> Logout </button> }
            </div>

        </div>
    )
})