import React from "react";
import { Navigate,Outlet } from "react-router-dom";
import { useUser } from "@/context/userContext";

const PrivateRoute = ({ children }) => {
  const {user, loading} = useUser();
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return user ? <Outlet/>:<Navigate to="/login"/>;
};

export default PrivateRoute;
