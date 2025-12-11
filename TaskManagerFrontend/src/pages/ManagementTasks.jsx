import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../api/api";
import ManagementSidebar from "../components/ManagementSidebar";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManagementTasks() {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    getTasks().then((res) => setTasks(res.data));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks(); // refresh list
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4">
      <ManagementSidebar />

      <main className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-50">Manage Tasks</h1>

          {user.role === "HEAD_MANAGER" && (
            <Link
              to="/manage/tasks/create"
              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-lg text-white"
            >
              + Create Task
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((t) => (
            <Card
              key={t.id}
              title={t.title || `Task #${t.id}`}
              footer={
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                  </div>

                  {user.role === "HEAD_MANAGER" && (
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/manage/tasks/${t.id}/edit`}
                        className="px-2 py-1 text-[10px] rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 text-[10px] rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              }
            >
              <p className="text-xs text-slate-300 mb-2 break-words whitespace-pre-wrap max-h-16 overflow-hidden">
                {t.description}
              </p>

              {t.employee && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] flex items-center justify-center font-bold">
                    {t.employee.name[0]}
                    {t.employee.surname[0]}
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="text-slate-200 font-medium">
                      {t.employee.name} {t.employee.surname}
                    </div>
                    <div className="text-slate-400">{t.employee.email}</div>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {tasks.length === 0 && (
            <p className="text-slate-500 text-sm col-span-full">No tasks.</p>
          )}
        </div>
      </main>
    </div>
  );
}
