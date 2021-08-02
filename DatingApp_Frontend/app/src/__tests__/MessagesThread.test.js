import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';

import { MessagesThread } from '../components/MessagesThread/MessagesThread';

test("renders MessagesThread component", () => {
    const userContext = {
        baseURL: "http://localhost:5000/api/",
        jwt: null,
        jwtID: null,
        jwtUsername: null,
        jwtExpiry: null,
        loggedIn: false,
        unreadMatches: 0
    }

    const setUserContext = jest.fn()

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ userContext, setUserContext }}>
                <MessagesThread match={{ params: { id: 1 }, isExact: true, path: "", url: "" }}/>
            </UserContext.Provider>
        </MemoryRouter>
    )

    const element = screen.getByText(/send a message/i)
    expect(element).toBeInTheDocument()
})