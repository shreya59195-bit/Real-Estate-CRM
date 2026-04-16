const Lead = require("../models/Lead");
const Notification = require("../models/Notification");

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error("GET LEADS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const { name, contact, interest, status } = req.body;

    if (!name || !contact || !interest) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const lead = await Lead.create({
      name,
      contact,
      interest,
      status,
    });

    await Notification.create({
      message: `New lead added: ${name}`,
      type: "lead",
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};