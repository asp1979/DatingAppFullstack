import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/PrivateRoute';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Matches } from './components/Matches/Matches';
import { Messages } from './components/Messages/Messages';
import { User } from './components/User/User';
import { UserContext } from './UserContext';
import jwtDecode from 'jwt-decode';

export const App = () => {

    const jwt = localStorage.getItem("jwt");

    const [userContext, setUserContext] = useState({
        jwt: jwt ? jwt : null,
        jwtID: jwt ? jwtDecode(jwt).nameid : null,
        jwtUsername: jwt ? jwtDecode(jwt).unique_name : null,
        jwtExpiry: jwt ? jwtDecode(jwt).exp : null,
        loggedIn: jwt ? true : false,
    })

    useEffect(() => {
        if(userContext.jwtExpiry < Date.now().valueOf() / 1000) {
            setUserContext({
                ...userContext,
                jwt: null,
                jwtUsername: null,
                jwtExpiry: null,
                loggedIn: false
            });
            localStorage.removeItem("jwt");
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Router>
            <UserContext.Provider value={{ userContext, setUserContext }}>

                <Navbar />
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <PrivateRoute path="/user/:id" component={User} />
                <PrivateRoute path="/matches" component={Matches} />
                <PrivateRoute path="/messages" component={Messages} />

            </UserContext.Provider>
        </Router>
    )
}