import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "parent") return <Navigate to="/dashboard/parent" replace />;
  if (user.role === "teacher") return <Navigate to="/dashboard/teacher" replace />;
  if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />;

  // fallback if role missing
  return <Navigate to="/dashboard/parent" replace />;
}
