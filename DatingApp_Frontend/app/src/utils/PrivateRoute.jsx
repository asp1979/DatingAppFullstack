import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../UserContext';

export const PrivateRoute = ({ component: Component, ...rest }) => {

    const { userContext } = useContext(UserContext);
    
    return (
        <Route {...rest} 
        render={
            props => userContext.loggedIn && userContext.jwt.length > 20
            ? <Component {...props} /> 
            : <Redirect to={{ pathname: "/login" }} />
        } />
    )
}
