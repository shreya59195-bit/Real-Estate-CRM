const Deal = require("../models/Deal");
const Notification = require("../models/Notification");

exports.createDeal = async (req, res) => {
  try {
    const { property, customer, amount, status } = req.body;

    if (!property || !customer || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deal = await Deal.create({
      property,
      customer,
      amount: Number(amount),
      status,
    });

    await Notification.create({
      message: `New deal added for ${customer}`,
      type: "deal",
    });

    if (status === "closed") {
      await Notification.create({
        message: `Deal closed for ${customer}`,
        type: "deal",
      });
    }

    res.status(201).json({
      message: "Deal created successfully",
      deal,
    });
  } catch (error) {
    console.error("CREATE DEAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.status(200).json(deals);
  } catch (error) {
    console.error("GET DEALS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        amount: Number(req.body.amount),
      },
      { new: true, runValidators: true }
    );

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.status(200).json({
      message: "Deal updated successfully",
      deal,
    });
  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("DELETE DEAL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};