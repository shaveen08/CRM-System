import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = localStorage.getItem("loggedUser");
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
