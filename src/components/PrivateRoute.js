import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../views/UserDashboard/AuthContext";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      element={user ? <Component /> : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
