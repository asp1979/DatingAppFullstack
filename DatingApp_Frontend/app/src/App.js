import './App.css';
import React, { Component } from 'react'

export default class App extends Component {

    state = {
        data: [],
        loading: true
    }

    async componentDidMount() {
        let get = await fetch("http://localhost:5000/api/v1/values").then(x => x.json())
        this.setState({ data: [...get], loading: false })
    }

    render() {
        return (
            <div>
                { this.state.data.map(x => <li> {x.name} </li>) }
            </div>
        )
    }
}