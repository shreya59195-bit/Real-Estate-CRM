export default function StatusBadge({ value }) {
  const normalized = String(value || "").toLowerCase();

  const styles = {
    active: "bg-blue-100 text-blue-700",
    sold: "bg-emerald-100 text-emerald-700",
    rented: "bg-orange-100 text-orange-700",
    new: "bg-sky-100 text-sky-700",
    contacted: "bg-indigo-100 text-indigo-700",
    "follow-up": "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    lost: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[normalized] || "bg-slate-100 text-slate-700"}`}>
      {value}
    </span>
  );
}