import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
        </Router>
    )
}
