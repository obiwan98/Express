// models/group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  office: { type: String, required: true },
  part: { type: String, required: true },
  team: { type: String, required: true }
});

module.exports = mongoose.model('Group', groupSchema);
