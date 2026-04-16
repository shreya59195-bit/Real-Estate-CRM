const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true
},
email: {
type: String,
default: "",
trim: true,
lowercase: true
},
phone: {
type: String,
required: true,
trim: true
},
notes: {
type: String,
default: ""
},
interactionHistory: [{ type: String }]
},
{ timestamps: true }
);
module.exports = mongoose.model("Customer", customerSchema);