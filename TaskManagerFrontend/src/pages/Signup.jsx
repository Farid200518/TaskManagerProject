import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not sign up. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/70">
        <h1 className="text-2xl font-bold mb-2 text-slate-50 text-center">
          Create an account
        </h1>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Sign up to start managing tasks and collaborating with your team.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-200">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-200">Surname</label>
              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-200">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-200">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-700 text-slate-100 focus:border-blue-500"
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="HR">HR</option>
              <option value="HR_MANAGER">HR_MANAGER</option>
              <option value="HEAD_MANAGER">HEAD_MANAGER</option>
            </select>
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="text-[11px] text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
