// models/role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  Role: { type: String, required: true },
  RoleName: { type: String, required: true }
});

module.exports = mongoose.model('Role', roleSchema);


