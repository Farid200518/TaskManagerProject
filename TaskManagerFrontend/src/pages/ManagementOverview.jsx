import { useEffect, useState } from "react";
import { getEmployees, getTasks } from "../api/api";
import ManagementSidebar from "../components/ManagementSidebar";
import { StatusBadge } from "../components/StatusBadge";

export default function ManagementOverview() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEmployees(), getTasks()])
      .then(([empRes, taskRes]) => {
        setEmployees(empRes.data);
        setTasks(taskRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4">
      <ManagementSidebar />
      <main className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold text-slate-50">Overview</h1>
        {loading ? (
          <p className="text-sm text-slate-300">Loading data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/40 rounded-2xl p-4">
                <p className="text-xs text-slate-200">Total employees</p>
                <p className="text-2xl font-bold text-blue-300">
                  {employees.length}
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4">
                <p className="text-xs text-slate-200">Total tasks</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {tasks.length}
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4">
                <p className="text-xs text-slate-200">Completed tasks</p>
                <p className="text-2xl font-bold text-amber-300">
                  {tasks.filter((t) => t.status === "DONE").length}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-sm font-semibold text-slate-100 mb-2">
                Latest employees
              </h2>

              <div className="max-h-64 overflow-auto text-xs">
                {employees.slice(-8).reverse().map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between border-b border-slate-800 py-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">

                      {/* 🔵 Jira-style avatar */}
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[11px] font-bold text-slate-200">
                        {e.name[0]}
                        {e.surname[0]}
                      </div>

                      {/* 📝 Name + Email */}
                      <div>
                        <p className="font-semibold text-slate-100">
                          {e.name} {e.surname}
                        </p>
                        <p className="text-slate-400 text-[11px]">{e.email}</p>
                      </div>
                    </div>

                    {/* 🎖 Role badge */}
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-200">
                      {e.role}
                    </span>
                  </div>
                ))}

                {employees.length === 0 && (
                  <p className="text-slate-400 text-xs">No employees.</p>
                )}
              </div>
            </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-100 mb-2">
                  Latest tasks
                </h2>
                <div className="max-h-64 overflow-auto text-xs">
                  {tasks.slice(-8).reverse().map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between border-b border-slate-800 py-2 last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-slate-100">
                          {t.title || `Task #${t.id}`}
                        </p>
                        <p className="text-slate-400 text-[11px]">

                          {t.employee && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] flex items-center justify-center font-bold text-slate-200">
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
                          
                        </p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-slate-400 text-xs">No tasks.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
