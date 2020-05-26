import './Navbar.css';
import React from 'react';

export default function Navbar() {
    return (
        <div className="navbar">
            <h1>Timder</h1>
            <ul>
                <li><a href="#">Matches</a></li>
                <li><a href="#">Lists</a></li>
                <li><a href="#">Messages</a></li>
            </ul>
            <form className="nav-inputs">
                <input placeholder="Username" type="email" name="" id=""/>
                <input placeholder="Password" type="password" name="" id=""/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
