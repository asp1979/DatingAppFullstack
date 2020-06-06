import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/PrivateRoute';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Messages } from './components/Messages/Messages';
import { UserContext } from './UserContext';

export const App = () => {

    const [userContext, setUserContext] = useState({
        loggedIn: localStorage.getItem("jwt") ? true : false, 
        jwt: localStorage.getItem("jwt") // || null
    })

    return (
        <Router>
            <UserContext.Provider value={{ userContext, setUserContext }}>
                <Navbar />
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <PrivateRoute path="/messages" component={Messages} />
            </UserContext.Provider>
        </Router>
    )
}