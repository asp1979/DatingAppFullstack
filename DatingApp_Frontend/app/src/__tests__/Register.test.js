import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';

import { Register } from '../components/Register/Register';

test("renders Register component", () => {
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
                <Register />
            </UserContext.Provider>
        </MemoryRouter>
    )

    const linkElement = screen.getByText(/password/i)
    expect(linkElement).toBeInTheDocument()
})