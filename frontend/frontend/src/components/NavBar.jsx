import { Bell, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Navbar({ setSidebarOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => setNotifications(res.data || []))
      .catch(() => {});
  }, []);

  const handleGlobalSearch = async () => {
    const q = searchText.trim();

    if (!q) {
      toast.error("Please enter something to search");
      return;
    }

    try {
      setSearching(true);

      const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
      const data = res.data;

      if (!data.results || data.results.length === 0) {
        toast.error(`No results found for "${q}"`);
        return;
      }

      if (data.results.length === 1) {
        toast.success(`1 result found for "${q}"`);
        navigate(data.results[0].path);
        return;
      }

      toast.success(`${data.results.length} results found for "${q}"`);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGlobalSearch();
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="relative flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-[220px] rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-10 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 sm:w-[320px]"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleGlobalSearch}
              disabled={searching}
              className="rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800 hover:scale-105 transition"
            >
              <Bell size={18} />
            </button>

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {notifications.length}
              </span>
            )}

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold">
                  Notifications
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 border-b border-slate-100 dark:border-slate-800 text-sm"
                      >
                        {item.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800 hover:scale-105 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="rounded-2xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
            <p className="font-semibold leading-tight">{user?.name || "User"}</p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {user?.role || "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}