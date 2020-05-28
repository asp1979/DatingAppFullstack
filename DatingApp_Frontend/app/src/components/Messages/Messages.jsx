import React, { Component } from 'react';

export default class Messages extends Component {

    componentDidMount() {
        const jwt = localStorage.getItem("token")
        if(!jwt) {
            this.props.history.push("/login")
        }
    }

    render() {
        return (
            <div className="page messages">
                <h1>Messages</h1>
            </div>
        )
    }
}
