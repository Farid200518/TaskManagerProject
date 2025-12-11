import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/70">
        <h1 className="text-2xl font-bold mb-2 text-slate-50 text-center">
          Employee Task Manager
        </h1>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Sign in with your company account to manage tasks and employees.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-slate-200">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-200">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-300 text-xs bg-red-950/60 border border-red-700 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-sm font-semibold text-white"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-[11px] text-slate-500 mt-4 text-center">
          New here?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
