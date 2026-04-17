import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
};

export const StudentRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "student") return <Navigate to="/login" />;
  return children;
};

export const CompanyRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "company") return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;

// ✅ ADMIN ROUTE
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (!token || role !== "admin") {
    return <Navigate to="/admin" />;
  }

  return children;
};