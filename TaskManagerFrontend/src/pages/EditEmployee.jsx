import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployee, updateEmployee } from "../api/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    getEmployee(id).then((res) => setEmployee(res.data));
  }, [id]);

  if (!employee) return <div className="p-6 text-white">Loading...</div>;

  const handleSave = async () => {
    // Only send name and surname
    const payload = {
      name: employee.name,
      surname: employee.surname
    };

    await updateEmployee(id, payload);
    navigate("/manage/employees");
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-white space-y-4">
      <h1 className="text-xl font-semibold">Edit Employee</h1>

      <label className="block text-sm">Name</label>
      <input
        className="w-full p-2 rounded bg-slate-800"
        value={employee.name}
        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
      />

      <label className="block text-sm">Surname</label>
      <input
        className="w-full p-2 rounded bg-slate-800"
        value={employee.surname}
        onChange={(e) => setEmployee({ ...employee, surname: e.target.value })}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
