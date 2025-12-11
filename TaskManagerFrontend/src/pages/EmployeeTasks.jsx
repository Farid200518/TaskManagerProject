import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmployee, getEmployeeTasks } from "../api/api";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";  // ✅ ADD THIS

export default function EmployeeTasks() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const empRes = await getEmployee(id);
      const tasksRes = await getEmployeeTasks(id);
      setEmployee(empRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-300">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Employee Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
          {employee.name[0]}
          {employee.surname[0]}
        </div>

        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            {employee.name} {employee.surname}
          </h1>
          <p className="text-slate-400 text-xs">{employee.email}</p>

          <Link
            to="/employees"
            className="text-blue-400 text-xs hover:underline mt-1 inline-block"
          >
            ← Back to Employees
          </Link>
        </div>
      </div>

      {/* Task list */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
        Assigned Tasks ({tasks.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`
              border rounded-xl bg-slate-900/70 shadow-md hover:shadow-xl transition 
              p-4 cursor-pointer border-l-4 
              ${
                t.status === "DONE"
                  ? "border-l-emerald-500"
                  : t.status === "IN_PROGRESS"
                  ? "border-l-blue-500"
                  : t.status === "RESOLVED"
                  ? "border-l-purple-500"
                  : "border-l-yellow-500"
              }
            `}
          >
            {/* Title + Status + Priority */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100">
                {t.title || `Task #${t.id}`}
              </h3>

              <div className="flex items-center gap-2">
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} /> {/* 🔥 Added */}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 mb-2 break-words whitespace-pre-wrap max-h-16 overflow-hidden">  
              {t.description}
            </p>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-slate-500 text-sm col-span-full text-center">
            This employee has no tasks.
          </p>
        )}
      </div>
    </div>
  );
}
