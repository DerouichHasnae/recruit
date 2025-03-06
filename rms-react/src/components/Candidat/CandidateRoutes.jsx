import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const CandidateRoutes = () => {
  const isAuthenticated = true; // Remplacez ici également par votre logique (un état local ou une variable)
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default CandidateRoutes;
