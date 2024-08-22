// models/approval.js
const mongoose = require("mongoose");

const approvalBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const approvalConfirmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  date: { type: Date, required: false },
  comment: { type: String, required: false },
});

const approvalPaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  receiptInfo: { type: String, required: false },
  receiptImgUrl: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: false },
});

const approvalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  book: [approvalBookSchema],
  comment: { type: String, required: false },
  regdate: { type: Date, required: false },
  state: { type: String, required: true },
  confirm: [approvalConfirmSchema],
  payment: [approvalPaymentSchema],
});

module.exports.Approval = mongoose.model("Approval", approvalSchema);
module.exports.Payment = mongoose.model("Payment", approvalPaymentSchema);
module.exports.Book = mongoose.model("Book", approvalBookSchema);
module.exports.Confirm = mongoose.model("Confirm", approvalConfirmSchema);
