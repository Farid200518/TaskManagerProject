import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees } from "../api/api";
import Card from "../components/Card";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-300">Loading employees...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {employees.map((e) => (
        <Link
          key={e.id}
          to={`/employees/${e.id}/tasks`}
          className="block hover:opacity-90 transition"
        >
          <Card>

            <div className="flex items-center gap-3">

              {/* 🔵 Avatar like Jira */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                {e.name[0]}{e.surname[0]}
              </div>

              {/* 📝 Name + Email */}
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {e.name} {e.surname}
                </p>
                <p className="text-xs text-slate-400">{e.email}</p>
                <p className="text-[10px] mt-1 text-slate-500">
                  {e.role}
                </p>
              </div>

            </div>

          </Card>
        </Link>
      ))}

      {employees.length === 0 && (
        <p className="text-slate-500 text-sm col-span-full text-center">
          No employees found.
        </p>
      )}
    </div>
  );
}
