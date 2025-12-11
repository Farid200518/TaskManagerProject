import { useEffect, useState } from "react";
import { getEmployeeTasks, changeTaskStatus } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    if (!user) return;
    setLoading(true);
    getEmployeeTasks(user.id)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleChangeStatus = async (taskId, newStatus) => {
    setSavingId(taskId);
    try {
      await changeTaskStatus({ taskId, status: newStatus });
      loadTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-300">Loading your tasks...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {tasks.map((t) => (
        <Card
          key={t.id}
          title={t.title || `Task #${t.id}`}
          footer={
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={t.status} />
            </div>
          }
        >
          <p className="text-xs text-slate-300 mb-2">{t.description}</p>
        </Card>
      ))}
      {tasks.length === 0 && (
        <p className="text-slate-500 text-sm col-span-full text-center">
          You have no tasks assigned.
        </p>
      )}
    </div>
  );
}
