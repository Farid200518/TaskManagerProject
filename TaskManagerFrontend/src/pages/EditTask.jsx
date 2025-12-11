import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTask, updateTask } from "../api/api";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    getTask(id).then((res) => setTask(res.data));
  }, [id]);

  if (!task) return <div className="p-6 text-slate-300">Loading...</div>;

    const handleSave = async () => {
        await updateTask(id, task);
        navigate("/manage/tasks");  // ← FIX
    };


  return (
    <div className="max-w-lg mx-auto p-4 text-white space-y-3">

      <h1 className="text-xl font-semibold">Edit Task</h1>

      <label className="block text-sm">
        Title:
        <input
          className="w-full p-2 rounded bg-slate-800 text-sm mt-1"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        Description:
        <textarea
          className="w-full p-2 rounded bg-slate-800 text-sm mt-1"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </label>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Save Changes
      </button>

    </div>
  );
}
