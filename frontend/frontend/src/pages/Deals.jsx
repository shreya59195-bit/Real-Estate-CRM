import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import TableCard from "../components/TableCard";

const initialForm = {
  property: "",
  customer: "",
  amount: "",
  status: "pending",
};

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchDeals = async () => {
    try {
      const res = await api.get("/deals");
      setDeals(res.data || []);
    } catch (error) {
      console.error("FETCH DEALS ERROR:", error);
      toast.error("Deals load nahi hui");
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingId) {
        await api.put(`/deals/${editingId}`, payload);
        toast.success("Deal updated successfully");
      } else {
        await api.post("/deals", payload);
        toast.success("Deal added successfully");
      }

      resetForm();
      fetchDeals();
    } catch (error) {
      console.error("DEAL SUBMIT ERROR:", error);
      toast.error(error.response?.data?.message || "Deal add failed");
    }
  };

  const handleEdit = (deal) => {
    setEditingId(deal._id);
    setForm({
      property: deal.property || "",
      customer: deal.customer || "",
      amount: deal.amount || "",
      status: deal.status || "pending",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deal?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/deals/${id}`);
      toast.success("Deal deleted successfully");
      fetchDeals();
    } catch (error) {
      console.error("DELETE DEAL ERROR:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredDeals = deals.filter((item) => {
    const matchesSearch =
      item.property?.toLowerCase().includes(search.toLowerCase()) ||
      item.customer?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus ? item.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const rows = [
      ["Property", "Customer", "Amount", "Status"],
      ...filteredDeals.map((d) => [
        d.property,
        d.customer,
        d.amount,
        d.status,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deals.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Deals" subtitle="Track deals and revenue pipeline" />

      <SectionCard title={editingId ? "Edit Deal" : "Add Deal"}>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            name="property"
            value={form.property}
            onChange={handleChange}
            placeholder="Property"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="customer"
            value={form.customer}
            onChange={handleChange}
            placeholder="Customer"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-2xl px-4 py-3"
          >
            <option value="pending">pending</option>
            <option value="closed">closed</option>
            <option value="lost">lost</option>
          </select>

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold"
            >
              {editingId ? "Update Deal" : "Add Deal"}
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

            <button
              type="button"
              onClick={exportCSV}
              className="bg-emerald-600 text-white rounded-2xl px-5 py-3 font-semibold"
            >
              Export CSV
            </button>
          </div>
        </form>
      </SectionCard>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-2xl px-4 py-3"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-2xl px-4 py-3"
        >
          <option value="">All Status</option>
          <option value="pending">pending</option>
          <option value="closed">closed</option>
          <option value="lost">lost</option>
        </select>
      </div>

      <TableCard
        title="Deals List"
        columns={[
          { key: "property", label: "Property" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount", render: (row) => `₹${row.amount}` },
          { key: "status", label: "Status", type: "status" },
        ]}
        data={filteredDeals}
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