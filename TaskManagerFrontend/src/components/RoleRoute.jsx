import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();

  // Wait until user is fully restored
  if (loading) {
    return (
      <div className="w-full text-center text-slate-300 mt-10">
        Loading...
      </div>
    );
  }

  // If no user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role safely
  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
