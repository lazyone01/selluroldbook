import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ allow, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="center-page">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
