import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const isAuthenticated = true; // Remplacez par votre logique d'authentification (par exemple un état local ou une variable)
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default AdminRoutes;
