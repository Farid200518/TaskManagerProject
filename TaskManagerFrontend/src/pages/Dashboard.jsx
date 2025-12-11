import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-50 mb-1">
          Welcome back, {user?.fullName || "User"} 👋
        </h1>
        <p className="text-xs text-slate-400">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Tasks">
          <p className="text-slate-300 text-sm">
            Track, update and follow the lifecycle of tasks assigned in your
            team.
          </p>
        </Card>
        <Card title="People">
          <p className="text-slate-300 text-sm">
            View and manage employees depending on your role in the
            organization.
          </p>
        </Card>
        <Card title="Activity">
          <p className="text-slate-300 text-sm">
            Task workflows keep a history of changes, so you always know who
            updated what.
          </p>
        </Card>
      </div>

      <Card title="Quick tips">
        <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
          <li>HEAD_MANAGER can create, edit and delete tasks and employees.</li>
          <li>HR_MANAGER can manage employees and view/manage tasks.</li>
          <li>HR can access employee data.</li>
          <li>
            EMPLOYEE can view and update the status of tasks assigned to them.
          </li>
        </ul>
      </Card>
    </div>
  );
}
