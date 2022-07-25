import React, { useContext } from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';
import { IUserContext } from './interfaces/Interfaces';

type PrivateRouteProps = {
    path: RouteProps["path"];
    component: React.ElementType;
};

export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({
    component: Component,
    ...rest
}) => {
    const { userContext } = useContext<IUserContext>(UserContext);

    return (
        <Route
        {...rest}
        render={
            props => userContext.loggedIn && userContext.jwt.length >= 128
            ? <Component {...props} />
            : <Redirect to={{ pathname: "/login" }} />
        }
        />
    )
}