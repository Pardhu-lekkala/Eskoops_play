import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../services/auth'

const PrivateRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            auth.isLoggedIn() ?
                <Component {...props} />
            : <Redirect to="/" exact/>
        )} />
    );
};

export default PrivateRoute;