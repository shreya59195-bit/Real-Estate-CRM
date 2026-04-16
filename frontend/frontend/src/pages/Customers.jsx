import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useSearch } from "../context/SearchContext";
import PageHeader from "../components/PageHeader";
import TableCard from "../components/TableCard";
import SectionCard from "../components/SectionCard";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export default function Customers() {
  const { globalSearch } = useSearch();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (error) {
      console.error("FETCH CUSTOMERS ERROR:", error);
      toast.error(error.response?.data?.message || "Customers load nahi hui");
    }
  };

  useEffect(() => {
    fetchCustomers();
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
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
        toast.success("Customer updated successfully");
      } else {
        await api.post("/customers", form);
        toast.success("Customer added successfully");
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("CUSTOMER SUBMIT ERROR:", error);
      toast.error(error.response?.data?.message || "Customer add nahi hua");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error("DELETE CUSTOMER ERROR:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(globalSearch.toLowerCase()) ||
    c.phone?.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Phone", "Notes"],
      ...filteredCustomers.map((c) => [c.name, c.email, c.phone, c.notes]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage customer records and interaction notes"
      />

      <SectionCard title={editingId ? "Edit Customer" : "Add Customer"}>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Customer name"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="border rounded-2xl px-4 py-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Short notes"
            className="border rounded-2xl px-4 py-3"
          />

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold"
            >
              {editingId ? "Update Customer" : "Add Customer"}
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
      </SectionCard>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={exportCSV}
          className="bg-emerald-600 text-white rounded-2xl px-5 py-3 font-semibold"
        >
          Export CSV
        </button>
      </div>

      <TableCard
        title="Customer List"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "notes", label: "Notes" },
        ]}
        data={filteredCustomers}
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