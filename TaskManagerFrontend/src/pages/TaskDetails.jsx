import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTask, getTaskWorkflows } from "../api/api";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

// Format ISO date → YYYY-MM-DD HH:mm:ss
const formatDate = (isoString) => {
  const d = new Date(isoString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    getTask(id).then((res) => setTask(res.data));
    getTaskWorkflows(id).then((res) => setWorkflows(res.data));
  }, [id]);

  if (!task) {
    return <div className="p-6 text-center text-slate-300">Loading task...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

      {/* ============================
          TASK CARD (Jira Style)
         ============================ */}
      <Card
        title={task.title || `Task #${task.id}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        }
      >
        {/* Description */}
        <p className="text-xs text-slate-300 mb-4 break-words whitespace-pre-wrap">
          {task.description}
        </p>

        {/* Avatar + Assigned user */}
        {task.employee && (
          <div className="flex items-center gap-3 mt-4">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow">
              {task.employee.name[0]}
              {task.employee.surname[0]}
            </div>

            <div className="text-xs leading-tight">
              <p className="text-slate-200 font-semibold">
                {task.employee.name} {task.employee.surname}
              </p>
              <p className="text-slate-400 text-[11px]">{task.employee.email}</p>
            </div>
          </div>
        )}
      </Card>

      {/* ============================
          WORKFLOW HISTORY
         ============================ */}
      <Card title="Workflow history">
        {workflows.length === 0 ? (
          <p className="text-xs text-slate-400">No workflow entries.</p>
        ) : (
          <ul className="space-y-3 text-xs">
            {workflows.map((wf) => (
              <li
                key={wf.id}
                className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0"
              >
                <StatusBadge status={wf.status} />
                <span className="text-slate-400">{formatDate(wf.lastUpdated)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
