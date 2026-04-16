import {
  Home,
  Building2,
  Users,
  UserRound,
  HandCoins,
  BriefcaseBusiness,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Properties", path: "/properties", icon: Building2 },
  { label: "Leads", path: "/leads", icon: UserRound },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Deals", path: "/deals", icon: HandCoins },
  { label: "Agents", path: "/agents", icon: BriefcaseBusiness },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full p-4">
          <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
            <div className="shrink-0 bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-700 p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold">
                    P
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">PropertyCRM</h1>
                  <p className="mt-1 text-sm text-blue-100">Premium real estate workspace</p>
                </div>

                <button
                  className="rounded-xl p-2 hover:bg-white/10 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Logged in as
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                  {user?.role || "admin"}
                </p>
              </div>

              <nav className="space-y-2 pb-6">
                {items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="shrink-0 border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}