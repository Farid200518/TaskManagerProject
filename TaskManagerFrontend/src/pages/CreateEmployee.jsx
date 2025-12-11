import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../api/api";
import Card from "../components/Card";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createEmployee(form); // 🔥 SENDS POST /employees
      navigate("/manage/employees"); // 🔥 redirect back to list
    } catch (err) {
      console.error(err);
      setError("Failed to create employee. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Add New Employee">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="p-2 bg-slate-900 border border-slate-700 rounded"
              required
            />
            <input
              name="surname"
              placeholder="Surname"
              value={form.surname}
              onChange={handleChange}
              className="p-2 bg-slate-900 border border-slate-700 rounded"
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            required
          />

          <select
            name="role"
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="HR">HR</option>
            <option value="HR_MANAGER">HR_MANAGER</option>
            <option value="HEAD_MANAGER">HEAD_MANAGER</option>
          </select>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </form>
      </Card>
    </div>
  );
}
