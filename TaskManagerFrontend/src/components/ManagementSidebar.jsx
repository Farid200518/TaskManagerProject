import { NavLink } from "react-router-dom";

export default function ManagementSidebar() {
  const base =
    "block px-3 py-2 rounded-lg text-xs font-medium mb-1 text-slate-300 hover:bg-slate-800 hover:text-slate-50";
  const active = "bg-slate-900 text-slate-50 border border-slate-700";

  return (
    <aside className="w-56 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 h-full">
      <h2 className="text-sm font-semibold mb-3 text-slate-100">
        Management Panel
      </h2>
      <NavLink
        to="/manage"
        end
        className={({ isActive }) => (isActive ? base + " " + active : base)}
      >
        Overview
      </NavLink>
      <NavLink
        to="/manage/employees"
        className={({ isActive }) => (isActive ? base + " " + active : base)}
      >
        Employees
      </NavLink>
      <NavLink
        to="/manage/tasks"
        className={({ isActive }) => (isActive ? base + " " + active : base)}
      >
        Tasks
      </NavLink>
    </aside>
  );
}
