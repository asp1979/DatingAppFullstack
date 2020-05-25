import React, { Component } from 'react'
import './App.css';

export default class App extends Component {

    render() {
        return (
            <div className="app">
                <div className="navbar">
                    <h1>Timder</h1>
                    <div className="nav-inputs">
                        <input placeholder="Username" type="email" name="" id=""/>
                        <input placeholder="Password" type="password" name="" id=""/>
                        <button>Login</button>
                    </div>
                </div>
            </div>
        )
    }
}