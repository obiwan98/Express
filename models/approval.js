// models/approval.js
const mongoose = require("mongoose");

const approvalBookSchema = new mongoose.Schema({
  name: { type: String, required: false },
  price: { type: Number, required: false },
});

const approvalConfirmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false,
  },
  date: { type: Date, required: false },
  comment: { type: String, required: false },
});

const approvalPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false,
  },
  receiptInfo: { type: String, required: false },
  receiptImgUrl: { type: String, required: false },
  price: { type: Number, required: false },
  date: { type: Date, required: false },
});

const approvalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  book: approvalBookSchema,
  comment: { type: String, required: false },
  regdate: { type: Date, required: true },
  state: { type: String, required: true },
  confirm: approvalConfirmSchema,
  payment: approvalPaymentSchema,
});

module.exports = mongoose.model("Approval", approvalSchema);
