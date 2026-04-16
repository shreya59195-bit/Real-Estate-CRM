export default function Agents() {
  const agents = [
    { id: 1, name: "Admin User", email: "admin@gmail.com", role: "admin" },
    { id: 2, name: "Sales Manager", email: "manager@gmail.com", role: "manager" },
    { id: 3, name: "Field Agent", email: "agent@gmail.com", role: "agent" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agents</h1>
      <div className="crm-card rounded-[28px] p-5">
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
              <p className="font-semibold">{agent.name}</p>
              <p className="text-sm text-slate-500">{agent.email}</p>
              <p className="text-sm capitalize">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}