export function PriorityBadge({ priority }) {
  const COLORS = {
    HIGH: "bg-red-500/20 text-red-300 border-red-500/40",
    MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    LOW: "bg-green-500/20 text-green-300 border-green-500/40",
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] rounded-full border ${COLORS[priority] || ""}`}
    >
      {priority}
    </span>
  );
}
