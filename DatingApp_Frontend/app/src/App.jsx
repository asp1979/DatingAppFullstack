import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Route exact path="/" component={Home} />
        </Router>
    )
}
