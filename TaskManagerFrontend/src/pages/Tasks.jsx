import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../api/api";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-300">Loading tasks...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {tasks.map((t) => (
        <Card
          key={t.id}
          title={t.title || `Task #${t.id}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <StatusBadge status={t.status} />

              {/* Priority now aligned to the right */}
              <PriorityBadge priority={t.priority} />
            </div>
          }
        >
          {/* Description */}
          <p className="text-xs text-slate-300 mb-2 break-words whitespace-pre-wrap max-h-16 overflow-hidden">
            {t.description}
          </p>

          {/* Jira-style assigned user */}
          {t.employee && (
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
                {t.employee.name[0]}
                {t.employee.surname[0]}
              </div>

              <div className="text-xs leading-tight">
                <p className="text-slate-200 font-semibold">
                  {t.employee.name} {t.employee.surname}
                </p>
                <p className="text-slate-400 text-[11px]">{t.employee.email}</p>
              </div>
            </div>
          )}

          {/* Details link moved DOWN */}
          <div className="mt-3">
            <Link
              to={`/tasks/${t.id}`}
              className="text-xs text-blue-400 hover:underline"
            >
              Details →
            </Link>
          </div>
        </Card>

      ))}

      {tasks.length === 0 && (
        <p className="text-slate-500 text-sm col-span-full text-center">
          No tasks found.
        </p>
      )}
    </div>
  );
}
