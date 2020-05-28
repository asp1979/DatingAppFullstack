import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {

    return (
        <div className="navbar">
            
            <div className="route-nav">
                <Link to="/"> <h1>Timder</h1> </Link>
                <Link to="/messages"> <p>Messages</p> </Link>
            </div>

            <div className="user-nav">
                <Link to="/Login"> Login </Link>
            </div>

        </div>
    )
}
