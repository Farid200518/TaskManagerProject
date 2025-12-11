import { useEffect, useState } from "react";
import { getEmployees} from "../api/api";
import { deleteEmployee} from "../api/api";
import ManagementSidebar from "../components/ManagementSidebar";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManagementEmployees() {
  const [employees, setEmployees] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await getEmployees(); // 🔥 GET /employees
    setEmployees(res.data);
  };

  const handleDelete = async (id) => {

  await deleteEmployee(id);   // 🔥 DELETE /employees/{id}
  loadEmployees();            // Refresh list
};


  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4">
      <ManagementSidebar />

      <main className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-50">
            Manage Employees
          </h1>

          {(user.role === "HEAD_MANAGER" || user.role === "HR_MANAGER") && (
            <Link
              to="/manage/employees/create"
              className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2 rounded-lg text-white"
            >
              + Add Employee
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {employees.map((e) => (
            <Card key={e.id}>
              <div className="flex items-center justify-between">
                {/* LEFT: Avatar + Name */}
                <Link to={`/employees/${e.id}/tasks`} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    {e.name[0]}{e.surname[0]}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-100">
                      {e.name} {e.surname}
                    </span>
                    <span className="text-xs text-slate-400">{e.email}</span>
                  </div>
                </Link>

                {/* RIGHT: Actions */}
                {(user.role === "HEAD_MANAGER" || user.role === "HR_MANAGER") && (
                  <div className="flex gap-2">
                    
                    {/* EDIT BUTTON */}
                    <Link
                      to={`/manage/employees/${e.id}/edit`}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded-md text-white"
                    >
                      Edit
                    </Link>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded-md text-white"
                    >
                      Delete
                    </button>

                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>


      </main>
    </div>
  );
}
