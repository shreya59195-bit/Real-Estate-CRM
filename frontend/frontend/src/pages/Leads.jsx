import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useSearch } from "../context/SearchContext";
import PageHeader from "../components/PageHeader";
import TableCard from "../components/TableCard";
import SectionCard from "../components/SectionCard";

const initialForm = {
  name: "",
  contact: "",
  interest: "",
  status: "new",
};

export default function Leads() {
  const { globalSearch } = useSearch();

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data || []);
    } catch (error) {
      console.error("FETCH LEADS ERROR:", error);
      toast.error(error.response?.data?.message || "Leads load nahi hui");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setAiMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        contact: form.contact,
        interest: form.interest,
        status: form.status,
      };

      if (editingId) {
        await api.put(`/leads/${editingId}`, payload);
        toast.success("Lead updated successfully");
      } else {
        await api.post("/leads", payload);
        toast.success("Lead added successfully");
      }

      resetForm();
      fetchLeads();
    } catch (error) {
      console.error("LEAD SUBMIT ERROR:", error);
      toast.error(error.response?.data?.message || "Lead add nahi hui");
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead._id);
    setForm({
      name: lead.name || "",
      contact: lead.contact || "",
      interest: lead.interest || "",
      status: lead.status || "new",
    });
    setAiMessage("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      console.error("DELETE LEAD ERROR:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const generateFollowUpMessage = () => {
    if (!form.name || !form.interest) {
      toast.error("Lead name and interest required for AI message");
      return;
    }

    const message = `Hello ${form.name}, thank you for your interest in ${form.interest}. We would love to help you with the next steps. Please let us know a convenient time for a follow-up call.`;

    setAiMessage(message);
    toast.success("AI follow-up message generated");
  };

  const filteredLeads = leads.filter((lead) => {
    const q = globalSearch.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(q) ||
      lead.contact?.toLowerCase().includes(q) ||
      lead.interest?.toLowerCase().includes(q);

    const matchesStatus = filterStatus ? lead.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const rows = [
      ["Name", "Contact", "Interest", "Status"],
      ...filteredLeads.map((l) => [l.name, l.contact, l.interest, l.status]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Track enquiries and sales prospects"
      />

      <SectionCard title={editingId ? "Edit Lead" : "Add Lead"}>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Lead name"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Phone / email"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="interest"
            value={form.interest}
            onChange={handleChange}
            placeholder="Interested in"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-2xl px-4 py-3"
          >
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="follow-up">follow-up</option>
            <option value="closed">closed</option>
          </select>

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold"
            >
              {editingId ? "Update Lead" : "Add Lead"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-200 rounded-2xl px-5 py-3 font-semibold"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            onClick={generateFollowUpMessage}
            className="bg-violet-600 text-white rounded-2xl px-5 py-3 font-semibold"
          >
            Generate AI Follow-up
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="bg-emerald-600 text-white rounded-2xl px-5 py-3 font-semibold"
          >
            Export CSV
          </button>
        </div>

        {aiMessage ? (
          <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
            <h4 className="font-semibold mb-2">AI Message</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {aiMessage}
            </p>
          </div>
        ) : null}
      </SectionCard>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-2xl px-4 py-3"
        >
          <option value="">All Status</option>
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="follow-up">follow-up</option>
          <option value="closed">closed</option>
        </select>
      </div>

      <TableCard
        title="Recent Leads"
        columns={[
          { key: "name", label: "Name" },
          { key: "contact", label: "Contact" },
          { key: "interest", label: "Interest" },
          { key: "status", label: "Status", type: "status" },
        ]}
        data={filteredLeads}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="bg-sky-100 text-sky-700 px-3 py-2 rounded-xl text-sm font-semibold"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}