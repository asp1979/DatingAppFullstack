import './Navbar.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { withRouter } from 'react-router-dom';

export const Navbar = withRouter(({ history }) => {

    const { userContext, setUserContext } = useContext(UserContext);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loading, setLoading] = useState(true);
    const baseURL = userContext.baseURL;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };
    const unreadMatches = userContext.unreadMatches;

    const logout = () => { 
        setUserContext({
            ...userContext,
            jwt: null,
            jwtID: null,
            jwtUsername: null,
            jwtExpiry: null,
            loggedIn: false,
            unreadMatches: 0
        });
        localStorage.removeItem("jwt");
        history.push("/")
    }

    const reload = () => {
        setTimeout(() => window.location.reload(), 10);
    }

    useEffect(() => {
        async function getUnreadMessagesCount() {
            if(userContext.loggedIn === true) {
                const messages = await fetch(baseURL + `v1/users/${userContext.jwtID}/messages`, headers) 
                if(messages.ok) {
                    const messagesJSON = await messages.json();
                    const unreadMessagesCount = messagesJSON.reduce((a,msg) => msg.isRead ? a + 0 : a + 1, 0);
                    setUnreadMessages(unreadMessagesCount);
                    setLoading(false);
                }
            }
        }
        getUnreadMessagesCount();

        const update = setInterval(() => getUnreadMessagesCount(), 1000);

        return () => clearInterval(update);

        // eslint-disable-next-line
    }, [userContext.loggedIn, userContext.jwtID])

    return (
        <div className="navbar">
            
            <div className="route-nav">
                <Link to="/">
                    <h1>Timder</h1>
                </Link>

                <Link to="/find">
                    <p>Find</p>
                </Link>

                { userContext.loggedIn && <Link to="/matches">
                    <p>Matches {!loading && unreadMatches > 0 && <span className="unread-count">{unreadMatches}</span>}</p>
                </Link> }

                { userContext.loggedIn && <Link to="/messages">
                    <p>Messages {!loading && unreadMessages > 0 && <span className="unread-count">{unreadMessages}</span>}</p>
                </Link> }
            </div>

            <div className="user-nav">
                { !userContext.loggedIn && <Link to="/login"> Login </Link> }
                { userContext.loggedIn && <Link to={"/user/" + userContext.jwtID} onClick={ reload }> { userContext.jwtUsername } </Link> }
                { userContext.loggedIn && <button onClick={ logout }> Logout </button> }
            </div>

        </div>
    )
})