import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Messages from './components/Messages/Messages';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/messages" component={Messages} />
        </Router>
    )
}
