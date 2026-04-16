import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function ChartsSection({ stats }) {
  const chartData = [
    { name: "Properties", value: stats.totalProperties || 0 },
    { name: "Leads", value: stats.totalLeads || 0 },
    { name: "Customers", value: stats.totalCustomers || 0 },
    { name: "Deals", value: stats.totalDeals || 0 },
  ];

  const revenueData = [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 180000 },
    { month: "Mar", sales: 220000 },
    { month: "Apr", sales: 250000 },
    { month: "May", sales: 210000 },
    { month: "Jun", sales: stats.revenue || 310000 },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">
      <div className="xl:col-span-8 crm-card crm-hover rounded-[28px] p-5 border border-white/70 dark:border-slate-800/80 fade-up">
        <h3 className="font-semibold text-lg mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="#93c5fd" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="xl:col-span-4 crm-card crm-hover rounded-[28px] p-5 border border-white/70 dark:border-slate-800/80 fade-up">
        <h3 className="font-semibold text-lg mb-4">CRM Records</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}