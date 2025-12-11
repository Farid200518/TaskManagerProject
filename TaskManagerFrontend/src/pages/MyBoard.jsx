import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../context/AuthContext";
import { getEmployeeTasks, changeTaskStatus } from "../api/api";
import Card from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";

const STATUS_ORDER = ["CREATED", "IN_PROGRESS", "RESOLVED", "DONE"];
const STATUS_LABELS = {
  CREATED: "Created",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  DONE: "Done",
};

export default function MyBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadTasks = () => {
    setLoading(true);
    getEmployeeTasks(user.id)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    if (sourceStatus === destStatus) return;

    const taskId = Number(draggableId);

    // Only Head Manager can move tasks to DONE
    if (user.role !== "HEAD_MANAGER" && destStatus === "DONE") {
      // just block drop: UI will snap back because we don't change state
      alert("Only Head Manager can mark tasks as DONE.");
      return;
    }

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: destStatus } : t))
    );

    try {
      setUpdating(true);
      await changeTaskStatus({ taskId, status: destStatus });
    } catch (err) {
      console.error(err);
      // reload to keep data consistent if backend fails
      loadTasks();
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-300">Loading your board...</div>
    );
  }

  const tasksByStatus = (status) =>
    tasks.filter((t) => t.status === status || (!t.status && status === "CREATED"));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">My Board</h1>
          <p className="text-xs text-slate-400">
            Drag your tasks between columns to update their status.
          </p>
        </div>
        {updating && (
          <div className="text-[11px] text-slate-400">
            Updating status...
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STATUS_ORDER.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 min-h-[200px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {tasksByStatus(status).length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {tasksByStatus(status).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(providedDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            {...providedDrag.dragHandleProps}
                          >
                            <Card
                              title={task.title || `Task #${task.id}`}
                              footer={<StatusBadge status={task.status} />}
                            >
                              <p className="text-xs text-slate-300 mb-2">
                                {task.description}
                              </p>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {tasksByStatus(status).length === 0 && (
                      <p className="text-[11px] text-slate-500 text-center mt-4">
                        No tasks here.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
