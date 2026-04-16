const Property = require("../models/Property");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.globalSearch = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(escapeRegex(q), "i");

    const [properties, leads, customers] = await Promise.all([
      Property.find({
        $or: [
          { title: regex },
          { location: regex },
          { type: regex },
          { description: regex },
          { status: regex },
        ],
      }).limit(20),

      Lead.find({
        $or: [
          { name: regex },
          { contact: regex },
          { interest: regex },
          { status: regex },
        ],
      }).limit(20),

      Customer.find({
        $or: [
          { name: regex },
          { email: regex },
          { phone: regex },
          { notes: regex },
        ],
      }).limit(20),
    ]);

    const results = [
      ...properties.map((item) => ({
        id: item._id,
        type: "property",
        title: item.title,
        subtitle: `${item.type} • ${item.location}`,
        extra: `₹${item.price} • ${item.status}`,
        path: "/properties",
      })),

      ...leads.map((item) => ({
        id: item._id,
        type: "lead",
        title: item.name,
        subtitle: `${item.contact} • ${item.interest}`,
        extra: item.status,
        path: "/leads",
      })),

      ...customers.map((item) => ({
        id: item._id,
        type: "customer",
        title: item.name,
        subtitle: `${item.email || "No email"} • ${item.phone}`,
        extra: item.notes || "No notes",
        path: "/customers",
      })),
    ];

    res.json({
      query: q,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};