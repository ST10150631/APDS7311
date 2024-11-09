import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // To decode JWT tokens

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const token = localStorage.getItem('token'); // Assuming the JWT is stored in localStorage
    let userRole = null;

    if (token) {
        try {
            const decoded = jwt_decode(token); // Decode the JWT to get the payload
            userRole = decoded.role; // Extract the role from the decoded token
        } catch (error) {
            console.error("Invalid token", error);
        }
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                // Check if the user's role is in the allowedRoles array
                allowedRoles.includes(userRole) ? (
                    <Component {...props} />
                ) : (
                    // Redirect to a "not authorized" page if not authorized
                    <Navigate to="/not-authorized" />
                )
            }
        />
    );
};

export default PrivateRoute;
