import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ permission }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (!loggedUser) {
    return <Navigate to="/" replace />;
  }

  if (permission && !loggedUser.access?.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
