import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import SummaryCards from "../components/SummaryCards";
import ChartsSection from "../components/ChartsSection";
import SectionCard from "../components/SectionCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalDeals: 0,
    revenue: 0,
  });

  const [recentProperties, setRecentProperties] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard/stats");

      setStats({
        totalProperties: res.data.totalProperties || 0,
        totalLeads: res.data.totalLeads || 0,
        totalCustomers: res.data.totalCustomers || 0,
        totalDeals: res.data.totalDeals || 0,
        revenue: res.data.revenue || 0,
      });

      setRecentProperties(res.data.recentProperties || []);
      setRecentLeads(res.data.recentLeads || []);
      setRecentDeals(res.data.recentDeals || []);
      setRecentNotifications(res.data.recentNotifications || []);
    } catch (error) {
      console.error("DASHBOARD LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Luxury CRM Dashboard"
        subtitle="Track properties, customers, deals and performance in one place."
      />

      <SummaryCards stats={stats} />
      <ChartsSection stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Recent Properties">
          {recentProperties.length === 0 ? (
            <p className="text-slate-500">No recent properties found.</p>
          ) : (
            <div className="space-y-3">
              {recentProperties.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {item.type} • {item.location}
                  </p>
                  <p className="text-sm mt-1">₹{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent Leads">
          {recentLeads.length === 0 ? (
            <p className="text-slate-500">No recent leads found.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"
                >
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.contact} • {item.interest}
                  </p>
                  <p className="text-sm mt-1 capitalize">{item.status}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent Deals">
          {recentDeals.length === 0 ? (
            <p className="text-slate-500">No recent deals found.</p>
          ) : (
            <div className="space-y-3">
              {recentDeals.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"
                >
                  <p className="font-semibold">{item.property}</p>
                  <p className="text-sm text-slate-500">
                    {item.customer} • ₹{item.amount}
                  </p>
                  <p className="text-sm mt-1 capitalize">{item.status}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent Notifications">
          {recentNotifications.length === 0 ? (
            <p className="text-slate-500">No notifications found.</p>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"
                >
                  <p className="font-medium">{item.message}</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">
                    {item.type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}