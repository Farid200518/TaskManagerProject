export function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold";
  const map = {
    CREATED: base + " bg-slate-700 text-slate-100",
    IN_PROGRESS: base + " bg-blue-500/20 text-blue-300 border border-blue-500/40",
    RESOLVED: base + " bg-purple-700 text-slate-100",
    DONE: base + " bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  };
  return <span className={map[status] || base}>{status}</span>;
}
