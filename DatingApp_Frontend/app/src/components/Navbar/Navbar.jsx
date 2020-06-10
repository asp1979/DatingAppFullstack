import './Navbar.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { withRouter } from 'react-router-dom';

export const Navbar = withRouter(({ history }) => {

    const { userContext, setUserContext } = useContext(UserContext);

    const logout = () => { 
        setUserContext({ ...userContext, loggedIn: false, jwt: null });
        localStorage.removeItem("jwt");
        setTimeout(() => history.push("/login"), 300);
    }

    return (
        <div className="navbar">
            
            <div className="route-nav">
                <Link to="/"> <h1>Timder</h1> </Link>
                <Link to="/messages"> <p>Messages</p> </Link>
            </div>

            <div className="user-nav">
                { !userContext.loggedIn && <Link to="/register"> Register </Link> }
                { !userContext.loggedIn && <Link to="/login"> Login </Link> }
                { userContext.loggedIn && <Link to="/user"> { userContext.jwtUsername } </Link> }
                { userContext.loggedIn && <button onClick={ logout }> Logout </button> }
            </div>

        </div>
    )
})