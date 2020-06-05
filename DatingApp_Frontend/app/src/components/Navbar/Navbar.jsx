import './Navbar.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export const Navbar = () => {

    const { userContext } = useContext(UserContext);

    return (
        <div className="navbar">
            
            <div className="route-nav">
                <Link to="/"> <h1>Timder</h1> </Link>
                <Link to="/messages"> <p>Messages</p> </Link>
            </div>

            <div className="user-nav">
                { !userContext.loggedIn && <Link to="/Login"> Login </Link> }
                { userContext.loggedIn && <Link to="/User"> User </Link> }
            </div>

        </div>
    )
}