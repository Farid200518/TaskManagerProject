import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for AuthProvider to finish restoring user from localStorage
  if (loading) {
    return (
      <div className="w-full text-center text-slate-300 mt-10">
        Loading...
      </div>
    );
  }

  // If still no user → need login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
