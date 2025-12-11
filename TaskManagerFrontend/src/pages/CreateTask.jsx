import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees, createTask } from "../api/api";
import Card from "../components/Card";

export default function CreateTask() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    employeeId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await getEmployees(); // 🔥 GET /employees
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTask(form); // 🔥 POST /tasks
      navigate("/manage/tasks"); // redirect to task list
    } catch (err) {
      console.error(err);
      alert("Failed to create task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Create Task">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <input
            name="title"
            placeholder="Task title"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <select
            name="priority"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <select
            name="employeeId"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            required
          >
            <option value="">Assign to employee</option>

            {employees
            .map((emp) => (
                <option key={emp.id} value={emp.id} disabled={emp.role === "HEAD_MANAGER"}>
                {emp.name} {emp.surname} — {emp.email} {emp.role === "HEAD_MANAGER" ? "(Not assignable)" : ""}
                </option>
            ))}

          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </Card>
    </div>
  );
}
