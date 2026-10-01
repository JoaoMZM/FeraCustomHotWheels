import { Navigate, Outlet } from "react-router-dom";

export const RotaAdmin = ({ usuario }) => {
  if (!usuario) {
    return <Navigate to="/admin/login" replace />;
  }

  if (usuario.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
