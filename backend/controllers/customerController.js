// @ts-nocheck
const Customer = require("../models/Customer");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);
    res.status(500).json({ message: "Customers fetch failed." });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    const customer = await Customer.create({
      name: String(name).trim(),
      email: email ? String(email).trim() : "",
      phone: String(phone).trim(),
      notes: notes ? String(notes).trim() : "",
      interactionHistory: [],
    });

    await Notification.create({
      message: `Customer created: ${name}`,
      type: "customer",
    });

    if (email) {
      try {
        await sendEmail(email, "Welcome to CRM", "Your profile has been added successfully.");
      } catch (e) {
        console.log("Email not sent:", e.message);
      }
    }

    res.status(201).json({
      message: "Customer created successfully.",
      customer,
    });
  } catch (error) {
    console.error("POST customer error:", error);
    res.status(500).json({
      message: error.message || "Customer creation failed.",
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({
      message: "Customer updated successfully.",
      customer,
    });
  } catch (error) {
    console.error("PUT customer error:", error);
    res.status(500).json({
      message: error.message || "Customer update failed.",
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("DELETE customer error:", error);
    res.status(500).json({
      message: error.message || "Customer delete failed.",
    });
  }
};