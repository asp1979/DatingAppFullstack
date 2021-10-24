import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';
import { IUserContext } from './interfaces/Interfaces';

interface IProps {
    path: string,
    component: React.ComponentType<any>
}

export const PrivateRoute = ({ component: Component, ...rest }: IProps): JSX.Element => {

    const { userContext } = useContext<IUserContext>(UserContext);
    
    return (
        <Route {...rest} 
        render={
            props => userContext.loggedIn && userContext.jwt.length >= 128
            ? <Component {...props} /> 
            : <Redirect to={{ pathname: "/login" }} />
        } />
    )
}