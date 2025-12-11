import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import MyTasks from "./pages/MyTasks";
import ManagementOverview from "./pages/ManagementOverview";
import ManagementEmployees from "./pages/ManagementEmployees";
import ManagementTasks from "./pages/ManagementTasks";
import CreateEmployee from "./pages/CreateEmployee";
import CreateTask from "./pages/CreateTask";
import EmployeeTasks from "./pages/EmployeeTasks";
import EditEmployee from "./pages/EditEmployee";



// 🆕 new imports
import MyBoard from "./pages/MyBoard";
import TeamBoard from "./pages/TeamBoard";
import EditTask from "./pages/EditTask";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 🆕 My Board for everyone */}
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <MyBoard />
              </ProtectedRoute>
            }
          />

          {/* 🆕 Team Board for managers */}
          <Route
            path="/team-board"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <TeamBoard />
              </RoleRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER", "HR"]}>
                <Employees />
              </RoleRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <Tasks />
              </RoleRoute>
            }
          />

          <Route
            path="/tasks/:id"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <TaskDetails />
              </RoleRoute>
            }
          />

          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <ManagementOverview />
              </RoleRoute>
            }
          />
          <Route
            path="/manage/employees"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <ManagementEmployees />
              </RoleRoute>
            }
          />
          <Route
            path="/manage/tasks"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <ManagementTasks />
              </RoleRoute>
            }
          />

          <Route
            path="/manage/employees/create"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <CreateEmployee />
              </RoleRoute>
            }
          />

          <Route
            path="/manage/tasks/create"
            element={
              <RoleRoute roles={["HEAD_MANAGER"]}>
                <CreateTask />
              </RoleRoute>
            }
          />

          <Route
            path="/employees/:id/tasks"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER", "HR"]}>
                <EmployeeTasks />
              </RoleRoute>
            }
          />

          <Route 
          path="/manage/tasks/:id/edit" 
          element={
              <RoleRoute roles={["HEAD_MANAGER"]}>
                <EditTask />
              </RoleRoute>
          } />

          <Route
            path="/manage/employees/:id/edit"
            element={
              <RoleRoute roles={["HEAD_MANAGER", "HR_MANAGER"]}>
                <EditEmployee />
              </RoleRoute>
            }
          />
      
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
