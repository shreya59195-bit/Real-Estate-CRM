const Property = require("../models/Property");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalLeads = await Lead.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalDeals = await Deal.countDocuments();

    const closedDeals = await Deal.find({ status: "closed" });
    const revenue = closedDeals.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const recentDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProperties,
      totalLeads,
      totalCustomers,
      totalDeals,
      revenue,
      recentProperties,
      recentLeads,
      recentDeals,
      recentNotifications,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};