import StatusBadge from "./StatusBadge";

export default function TableCard({ title, columns, data, actions, emptyText = "No records found." }) {
  return (
    <div className="crm-card crm-hover rounded-[28px] p-5 border border-white/70 dark:border-slate-800/80 overflow-hidden fade-up">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live records from your CRM workspace
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-slate-50/80 dark:bg-slate-900/60">
            <tr className="text-left text-slate-500 dark:text-slate-400">
              {columns.map((col) => (
                <th key={col.key} className="py-4 px-4 font-medium text-sm">{col.label}</th>
              ))}
              {actions ? <th className="py-4 px-4 font-medium text-sm">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-10 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id || row.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition">
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4 align-top text-sm sm:text-[15px]">
                      {col.type === "status" ? <StatusBadge value={row[col.key]} /> : col.render ? col.render(row) : row[col.key] ?? "-"}
                    </td>
                  ))}
                  {actions ? <td className="py-4 px-4">{actions(row)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}