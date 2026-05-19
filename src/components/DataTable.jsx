export default function DataTable({ columns, rows, empty = 'No data' }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>{columns.map((c) => <th key={c.key} className="p-3">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-3">{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="p-6 text-center text-slate-500">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
