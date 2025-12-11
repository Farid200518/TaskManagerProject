export default function Card({ title, children, footer }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/60 flex flex-col">
      {title && (
        <h2 className="text-lg font-semibold mb-3 text-slate-50">{title}</h2>
      )}
      <div className="flex-1 text-sm text-slate-200">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-slate-800">{footer}</div>}
    </div>
  );
}
