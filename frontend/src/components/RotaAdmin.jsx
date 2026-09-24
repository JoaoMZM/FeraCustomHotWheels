import { Navigate, Outlet } from "react-router-dom";

export const RotaAdmin = ({ usuario }) => {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/produtos" replace />;
  }

  return <Outlet />;
};