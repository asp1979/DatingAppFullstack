import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../UserContext';

import { Find } from '../components/Find/Find';

test("renders Find component", () => {
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
                <Find />
            </UserContext.Provider>
        </MemoryRouter>
    )

    const linkElement = screen.getByTestId("find-component")
    expect(linkElement).toBeInTheDocument()
})