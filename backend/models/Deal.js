const mongoose = require("mongoose");
const dealSchema = new mongoose.Schema(
{
property: {
type: mongoose.Schema.Types.ObjectId,
ref: "Property",
required: true
},
customer: {
type: mongoose.Schema.Types.ObjectId,
ref: "Customer",
required: true
},
amount: {
type: Number,
required: true,
min: 0
},
status: {
type: String,
enum: ["pending", "won", "lost"],
default: "pending"
}
},
{ timestamps: true }
);
module.exports = mongoose.model("Deal", dealSchema);