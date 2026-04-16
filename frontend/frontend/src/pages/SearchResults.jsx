import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch (error) {
      console.error("SEARCH RESULTS ERROR:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      loadResults();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Results"
        subtitle={query ? `Results for "${query}"` : "Search anything from navbar"}
      />

      <SectionCard title="Matched Records">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-slate-500">No matching result found.</p>
        ) : (
          <div className="space-y-4">
            {results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {item.type}
                    </p>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.subtitle}</p>
                    <p className="text-sm mt-1">{item.extra}</p>
                  </div>

                  <button
                    onClick={() => navigate(item.path)}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}