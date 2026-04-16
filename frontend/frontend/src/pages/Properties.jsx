import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useSearch } from "../context/SearchContext";
import PageHeader from "../components/PageHeader";
import TableCard from "../components/TableCard";
import SectionCard from "../components/SectionCard";

const initialForm = {
  title: "",
  type: "Apartment",
  price: "",
  location: "",
  area: "",
  status: "active",
  image: "",
  description: "",
};

export default function Properties() {
  const { globalSearch } = useSearch();

  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");
      console.log("PROPERTIES DATA:", res.data);
      setProperties(res.data || []);
    } catch (error) {
      console.error("FETCH PROPERTIES ERROR:", error);
      toast.error(error.response?.data?.message || "Properties load nahi hui");
    }
  };

  useEffect(() => {
    fetchProperties();
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
      setLoading(true);

      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
      };

      if (editingId) {
        await api.put(`/properties/${editingId}`, payload);
        toast.success("Property updated successfully");
      } else {
        await api.post("/properties", payload);
        toast.success("Property added successfully");
      }

      resetForm();
      fetchProperties();
    } catch (error) {
      console.error("PROPERTY SUBMIT ERROR:", error);
      toast.error(error.response?.data?.message || "Property add nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setForm({
      title: property.title || "",
      type: property.type || "Apartment",
      price: property.price || "",
      location: property.location || "",
      area: property.area || "",
      status: property.status || "active",
      image: property.image || "",
      description: property.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/properties/${id}`);
      toast.success("Property deleted successfully");
      fetchProperties();
    } catch (error) {
      console.error("DELETE PROPERTY ERROR:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredProperties = properties.filter((item) => {
    const q = globalSearch.trim().toLowerCase();

    const matchesSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q);

    const matchesStatus = filterStatus ? item.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  console.log("GLOBAL SEARCH:", globalSearch);
  console.log("FILTERED PROPERTIES:", filteredProperties);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        subtitle="Add, update and manage property listings"
      />

      <SectionCard title={editingId ? "Edit Property" : "Add Property"}>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Property title"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded-2xl px-4 py-3"
          >
            <option>Apartment</option>
            <option>Villa</option>
            <option>Commercial</option>
            <option>Plot</option>
          </select>

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            type="number"
            placeholder="Area (sq ft)"
            className="border rounded-2xl px-4 py-3"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-2xl px-4 py-3"
          >
            <option value="active">active</option>
            <option value="sold">sold</option>
            <option value="rented">rented</option>
          </select>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border rounded-2xl px-4 py-3 md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded-2xl px-4 py-3 xl:col-span-4 min-h-28"
          />

          <div className="xl:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-2xl px-5 py-3 font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Property"
                : "Add Property"}
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-2xl px-4 py-3"
        >
          <option value="">All Status</option>
          <option value="active">active</option>
          <option value="sold">sold</option>
          <option value="rented">rented</option>
        </select>
      </div>

      <TableCard
        title="Property Listings"
        columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "price", label: "Price", render: (row) => `₹${row.price}` },
          { key: "location", label: "Location" },
          { key: "area", label: "Area" },
          { key: "status", label: "Status", type: "status" },
        ]}
        data={filteredProperties}
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