import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={user ? "/" : "/login"} className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold">
            T
          </span>
          <span className="font-semibold tracking-wide text-slate-100">
            TaskManager
          </span>
        </Link>

        {/* Navigation */}
        {user && (
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-slate-200 hover:text-blue-400">
              Dashboard
            </Link>

            {/* ✔ Show Board for everyone EXCEPT Head Manager */}
            {user.role !== "HEAD_MANAGER" && (
              <Link
                to="/board"
                className="text-slate-200 hover:text-blue-400"
              >
                Board
              </Link>
            )}

            {/* ✔ Team Board for managers */}
            {(user.role === "HEAD_MANAGER" || user.role === "HR_MANAGER") && (
              <Link
                to="/team-board"
                className="text-slate-200 hover:text-blue-400"
              >
                Team Board
              </Link>
            )}

            {/* ✔ Employees page for HR, HR_MANAGER, HEAD_MANAGER */}
            {(user.role === "HEAD_MANAGER" ||
              user.role === "HR_MANAGER" ||
              user.role === "HR") && (
              <Link
                to="/employees"
                className="text-slate-200 hover:text-blue-400"
              >
                Employees
              </Link>
            )}

            {/* ✔ Tasks page for HR_MANAGER + HEAD_MANAGER */}
            {(user.role === "HEAD_MANAGER" ||
              user.role === "HR_MANAGER") && (
              <Link
                to="/tasks"
                className="text-slate-200 hover:text-blue-400"
              >
                Tasks
              </Link>
            )}

            {/* ✔ My Tasks for everyone EXCEPT Head Manager */}
            {user.role !== "HEAD_MANAGER" && (
              <Link
                to="/my-tasks"
                className="text-slate-200 hover:text-blue-400"
              >
                My Tasks
              </Link>
            )}

            {/* ✔ Management area */}
            {(user.role === "HEAD_MANAGER" || user.role === "HR_MANAGER") && (
              <Link to="/manage" className="text-slate-200 hover:text-blue-400">
                Management
              </Link>
            )}

            {/* ✔ Create Task button (HEAD_MANAGER only) */}
            {user.role === "HEAD_MANAGER" && (
              <Link
                to="/manage/tasks/create"
                className="text-slate-200 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                + Create Task
              </Link>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-right text-xs leading-tight">
                <div className="font-semibold text-slate-100">
                  {user.fullName}
                </div>
                <div className="text-[11px] text-slate-400">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
