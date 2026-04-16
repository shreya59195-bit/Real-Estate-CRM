import { Activity, BadgeIndianRupee, Building2, CircleCheckBig, Sparkles } from "lucide-react";

export default function SummaryCards({ stats }) {
  const cards = [
    { label: "Total Properties", value: stats.totalProperties || 0, icon: Building2, note: "+12% this month" },
    { label: "Total Leads", value: stats.totalLeads || 0, icon: Activity, note: "Fresh enquiries" },
    { label: "Total Customers", value: stats.totalCustomers || 0, icon: Sparkles, note: "Customer records" },
    { label: "Total Deals", value: stats.totalDeals || 0, icon: CircleCheckBig, note: "Sales pipeline" },
    { label: "Revenue", value: `₹${stats.revenue || 0}`, icon: BadgeIndianRupee, note: "Closed deals total" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="crm-card crm-hover rounded-[28px] p-5 border border-white/70 dark:border-slate-800/80 fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                <h3 className="text-2xl xl:text-[1.75rem] font-bold mt-3 text-slate-900 dark:text-white">
                  {card.value}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Icon size={20} />
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">{card.note}</p>
          </div>
        );
      })}
    </div>
  );
}