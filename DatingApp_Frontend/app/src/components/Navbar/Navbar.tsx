import './Navbar.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { withRouter } from 'react-router-dom';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IMessage, IUserContext } from '../../interfaces/Interfaces';

export const Navbar = withRouter(({ history }): JSX.Element => {

    const { userContext, setUserContext } = useContext<IUserContext>(UserContext);
    const { get } = useTimderApi();
    const [loading, setLoading] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const unreadMatches = userContext.unreadMatches;

    const logout = () => {
        setUserContext({
            ...userContext,
            jwt: "",
            jwtID: "",
            jwtUsername: "",
            jwtPhotoUrl: "",
            jwtExpiry: -1,
            loggedIn: false,
            unreadMatches: 0
        });
        localStorage.removeItem("jwt");
        history.push("/");
    }

    const reload = () => {
        setTimeout(() => window.location.reload(), 10);
    }

    useEffect(() => {
        async function getUnreadMessagesCount() {
            if(userContext.loggedIn === true) {
                await get(`v1/users/${userContext.jwtID}/messages`)
                .then(messages => {
                    const unreadMessagesCount = messages.reduce((a: number, msg: IMessage) => msg.isRead ? a + 0 : a + 1, 0);
                    setUnreadMessages(unreadMessagesCount);
                    setLoading(false);
                })
                .catch(err => console.error(err))
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

                {userContext.loggedIn &&
                    <Link to="/matches">
                        <p>Matches {!loading && unreadMatches > 0 && <span className="unread-count">{unreadMatches}</span>}</p>
                    </Link>
                }

                {userContext.loggedIn &&
                    <Link to="/messages">
                        <p>Messages {!loading && unreadMessages > 0 && <span className="unread-count">{unreadMessages}</span>}</p>
                    </Link>
                }
            </div>

            <div className="user-nav">
                {userContext.loggedIn
                    ? <div className="user-drop">
                        <div className="avatar">
                            <img src={userContext.jwtPhotoUrl} alt="user"></img>
                        </div>
                        <div className="user-drop-content">
                            <Link to={"/user/" + userContext.jwtID} onClick={reload}>Profile</Link>
                            <Link to={"/"} onClick={logout}>Logout</Link>
                        </div>
                    </div>
                    : <Link to="/login">
                        Sign in
                    </Link>
                }
            </div>

        </div>
    )
})