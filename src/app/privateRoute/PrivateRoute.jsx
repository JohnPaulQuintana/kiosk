import React from "react";
import { Navigate, useLocation } from "react-router-dom"; // Import Navigate
import { handleNotification } from "../../utils/warningHelper";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken"); // Retrieve the auth token

  if (!token) {
    // Trigger the warning notification if the user is not authenticated
    handleNotification(
      "/login", // Redirect to login page
      "Access Denied",
      "You need to log in to access this page."
    );
    // Redirect the user to the login page
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
